import Subscription from "../../models/Subscription";
import transporter from "../../config/mail";
import request from "supertest";
import app from "../../app";

setupTestDB();

jest.mock("../../config/mail", () => ({
    sendMail: jest.fn(),
    close: jest.fn()
}));

let subscription;

describe("suscribe api", () => {
    beforeEach(async () => {
        subscription = await Subscription.create({ email: "test@gmail.com" }); 
    });

    afterEach(async () => {
        await Subscription.deleteMany();

        subscription = null;
    });

    describe("Suscribe", () => {
        it("it should create a subscription and send an email", async () => {
            const sendMail = jest.fn();
            transporter.sendMail.mockImplementation(sendMail);

            const res = await request(app)
                .post("/api/suscribe/")
                .send({ email: "test321@gmail.com" });

            expect(res.body).toEqual({
                status: true,
                message: "An email was just sent to confirm your subscription"
            });

            const subscription = await Subscription.findOne({ email: "test321@gmail.com" });

            expect(sendMail).toHaveBeenCalledWith({
                from: "example@gmail.com",
                to: "test321@gmail.com",
                subject: "Confirm your subscription to Fernando Vaca Tamayo Blog",
                html: `
                <a href="http://localhost:3000?subscriptionId=${subscription._id}">
                    Holi
                </a>
                `
            });
        });
    });

    describe("Confirm", () => {
        it("It should activate email", async () => {
            const res = await request(app)
                .post("/api/suscribe/confirm/")
                .send({ subscriptionId: subscription.toObject()._id });

            expect(res.body).toEqual({
                status: true,
                message: "You have successfully subscribed"
            });

            const newSubscription = await Subscription.findOne({ email: "test@gmail.com" });

            expect(newSubscription.active).toBeTruthy();
        });

        it("It should get a subscription error", async () => {
            const res = await request(app)
                .post("/api/suscribe/confirm/")
                .send({ subscriptionId: "6eb5cc08d189732d6813299a" });

            expect(res.body).toEqual({ status: false, error: {
                message: "The subscription doesn't exists"
            } });
        });
    });
});