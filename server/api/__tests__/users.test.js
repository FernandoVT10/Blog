import User from "../../models/User";
import jwtAuthentication from "../../utils/jwtAuthentication";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import supertest from "supertest";
import app from "../../app";

const request = supertest(app);

jest.mock("../../utils/jwtAuthentication");
jest.mock("jsonwebtoken");
jest.mock("bcrypt");
jest.mock("../../config/constants", () => ({
    JWT_SECRET_KEY: "secret key"
}));

setupTestDB("test_users");

let user = null;

describe("Users API", () => {
    beforeEach(async () => {
        user = await User.create({
            username: "username",
            password: "password"
        });
    });

    afterEach(() => {
        jwtAuthentication.mockReset();
        bcrypt.compareSync.mockReset();
        jwt.sign.mockReset();
        user = null;
    });
    
    describe("Is Logged", () => {
        it("It should get true", async () => {
            jwtAuthentication.mockImplementation((req, _res, next) => {
                const bearer = req.headers["authorization"].split(' ');
                const token = bearer[1];

                req.userId = token;

                next();
            });

            const res = await request
                .get("/api/users/isLogged")
                .set("Authorization", `Bearer ${user._id}`);

            expect(res.body.data.isLogged).toBeTruthy();
        });

        it("It should get false", async () => {
            jwtAuthentication.mockImplementation((req, _res, next) => {
                const bearer = req.headers["authorization"].split(' ');
                const token = bearer[1];

                req.userId = token;

                next();
            });

            const res = await request
                .get("/api/users/isLogged")
                .set("Authorization", `Bearer abcefabcefabcefabcefabce`);

            expect(res.body.data.isLogged).toBeFalsy();
        });
    });

    describe("Login", () => {
        it("It should get the token", async () => {
            const compareSyncMock = jest.fn(() => true);
            const signMock = jest.fn(() => "test_token");
            
            bcrypt.compareSync = compareSyncMock;
            jwt.sign = signMock;

            const res = await request
                .post("/api/users/login")
                .send({ username: "username", password: "test_password" });

            expect(compareSyncMock).toHaveBeenCalledWith("test_password", user.password);
            expect(signMock).toHaveBeenCalledWith({ userId: user._id }, "secret key");
            expect(res.body).toEqual({
                data: {
                    message: "You successfully logged in",
                    token: "test_token"
                }
            });
        });

        it("It should get a username and password error", async () => {
            const compareSyncMock = jest.fn(() => false);
            bcrypt.compareSync = compareSyncMock;

            const res = await request
                .post("/api/users/login")
                .send({ username: "username", password: "test_password" });

            expect(compareSyncMock).toHaveBeenCalledWith("test_password", user.password);
            expect(res.body).toEqual({
                errors: [
                    {
                        status: 200,
                        message: "The username or password are incorrect"
                    }
                ]
            });
        });

        it("It should get a 404 error", async () => {
            const res = await request
                .post("/api/users/login")
                .send({ username: "username 2", password: "test_password" });

            expect(res.body).toEqual({
                errors: [
                    {
                        status: 404,
                        message: "The username doesn't exist"
                    }
                ]
            });
        });
    });
});