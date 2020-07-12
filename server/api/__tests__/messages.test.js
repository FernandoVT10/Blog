import Message from "../../models/Message";
import transporter from "../../config/mail";
import supertest from "supertest";
import app from "../../app";

const request = supertest(app);

setupTestDB("test_messages");

jest.mock("../../config/mail", () => ({
    sendMail: jest.fn(),
    close: jest.fn()
}));

describe("messages api", () => {
    describe("Add Message", () => {
        it("it should create a message and send an email", async () => {
            const sendMail = jest.fn();
            transporter.sendMail.mockImplementation(sendMail);

            const res = await request
                .post("/api/messages/")
                .send({ email: "test@gmail.com", message: "Test message" });

            expect(res.body).toEqual({
                data: { message: "Your message has been sent successfully" }
            });

            const { message } = await Message.findOne({ email: "test@gmail.com" });

            expect(message).toBe("Test message");

            expect(sendMail).toHaveBeenCalledWith({
                from: "example@gmail.com",
                to: "test@gmail.com",
                subject: "Fernando Vaca Tamayo Blog",
                html: `Your message has been sent successfully`
            });
        });
    });
});