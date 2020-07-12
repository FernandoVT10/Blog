import Subscription from "../../models/Subscription";
import transporter from "../../config/mail";
import supertest from "supertest";
import app from "../../app";
import loadTemplate from "../../utils/loadTemplate";
import { DOMAIN } from "../../config/constants";

const request = supertest(app);

setupTestDB("test_subscription");

jest.mock("../../config/mail", () => ({
    sendMail: jest.fn(),
    close: jest.fn()
}));

jest.mock("../../utils/loadTemplate");

let subscription;

describe("suscribe api", () => {
    beforeEach(async () => {
        subscription = await Subscription.create({ email: "test@gmail.com" }); 
    });

    afterEach(async () => {
        await Subscription.deleteMany();
        loadTemplate.mockReset();

        subscription = null;
    });

    describe("Suscribe", () => {
        it("it should create a subscription and send an email", async () => {
            loadTemplate.mockImplementation(() => "Test mail");

            const sendMail = jest.fn();
            transporter.sendMail.mockImplementation(sendMail);

            const res = await request
                .post("/api/subscribe/")
                .send({ email: "test321@gmail.com" });

            expect(res.body).toEqual({
                data: {
                    message: "An email was just sent to confirm your subscription"
                }
            });

            const subscription = await Subscription.findOne({ email: "test321@gmail.com" });

            expect(loadTemplate).toHaveBeenCalledWith("subscription", {
                url: DOMAIN,
                subscriptionId: subscription._id
            });

            expect(sendMail).toHaveBeenCalledWith({
                from: "example@gmail.com",
                to: "test321@gmail.com",
                subject: "Confirm your subscription to Fernando Vaca Tamayo Blog",
                html: "Test mail"
            });
        });
    });

    describe("Confirm Subscription", () => {
        it("It should activate email", async () => {
            const res = await request.put(`/api/subscribe/${subscription._id}/confirm/`);

            expect(res.body).toEqual({
                data: {
                    message: "You have successfully subscribed"
                }
            });

            const newSubscription = await Subscription.findOne({ email: "test@gmail.com" });

            expect(newSubscription.active).toBeTruthy();
        });

        it("It should get a subscription error", async () => {
            const res = await request.put(`/api/subscribe/abcefabcefabcefabcefabce/confirm/`);

            expect(res.body).toEqual({
                errors: [
                    {
                        status: 404,
                        message: "The subscription doesn't exists"
                    }
                ]
            });
        });
    });
});