import jwt from "jsonwebtoken";
import jwtAuthentication from "../jwtAuthentication";
import { JWT_SECRET_KEY } from "../../config/constants";

jest.mock("../../config/constants", () => ({
    JWT_SECRET_KEY: "secret key"
}));

const REQ_MOCK = {
    headers: {
        authorization: "Bearer Test Token"
    }
};

const RES_MOCK = {
    sendStatus: jest.fn()
}

const NEXT_MOCK = jest.fn();

describe("JWT Authentication", () => {
    beforeEach(() => {
        RES_MOCK.sendStatus.mockReset();
        NEXT_MOCK.mockReset();
    });

    it("It should send a status 403 because the authorization header is undefined", () => {
        jwtAuthentication({ headers: {} }, RES_MOCK, NEXT_MOCK);

        expect(RES_MOCK.sendStatus).toBeCalledTimes(1);
        expect(RES_MOCK.sendStatus).toBeCalledWith(403);
    });

    it("It should send a status 403 because the authorization token is invalid", () => {
        jwtAuthentication(REQ_MOCK, RES_MOCK, NEXT_MOCK);

        expect(RES_MOCK.sendStatus).toBeCalledTimes(1);
        expect(RES_MOCK.sendStatus).toBeCalledWith(403);
    });

    it("It should call next function and add userId parameter in req", () => {
        const token = jwt.sign({ userId: "test id" }, JWT_SECRET_KEY);

        const req = {
            headers: {
                authorization: "Bearer " + token
            }
        };

        jwtAuthentication(req, RES_MOCK, NEXT_MOCK);

        expect(req.userId).toBe("test id");
        expect(RES_MOCK.sendStatus).not.toBeCalled();
        expect(NEXT_MOCK).toBeCalled();
    });
});