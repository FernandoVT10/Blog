import Message from "../../models/Message";
import transporter from "../../config/mail";
import supertest from "supertest";
import app from "../../app";

const MESSAGES_MOCK = [
    {
        email: "test@example.com",
        message: "test message",
        createdAt: Date.now() + 1
    },
    {
        email: "test2@example.com",
        message: "test message 2",
        createdAt: Date.now() + 5
    },
    {
        email: "test3@example.com",
        message: "test message 3",
        createdAt: Date.now() + 10
    }
];

const request = supertest(app);

setupTestDB("test_messages");

jest.mock("../../config/mail", () => ({
    sendMail: jest.fn(),
    close: jest.fn()
}));

jest.mock("../../utils/loadTemplate", () => {
    return (name) => `template name: ${name}`;
});

jest.mock("../../utils/jwtAuthentication", () => {
    return (_req, _res, next) => next();
});

describe("messages api", () => {
    beforeEach(async () => {
        await Message.insertMany(MESSAGES_MOCK);
    });
    
    describe("Get Messages", () => {
        it("should get all messages", async () => {
            const res = await request.get("/api/messages/");

            const { messages } = res.body.data;

            expect(messages[0].email).toBe("test3@example.com");
            expect(messages[1].email).toBe("test2@example.com");
            expect(messages[2].email).toBe("test@example.com");
        });
    });

    describe("Get Pending Messages", () => {
        it("should get all pending messages", async () => {
            await Message.findOneAndUpdate(
                { email: "test2@example.com" },
                { viewed: true }
            );

            const res = await request.get("/api/messages/pendingMessages/");

            const { count } = res.body.data;

            expect(count).toBe(2);
        });
    });

    describe("Add Message", () => {
        it("should create a message and send an email", async () => {
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
                subject: "I have received your message",
                html: "template name: messageSent"
            });
        });
    });

    describe("Update Message", () => {
        it("should activate the message", async () => {
            const message  = await Message.findOne({ email: "test2@example.com" });

            const res = await request
                .put(`/api/messages/${message._id}`)
                .send({ viewed: true });

            const { updatedMessage } = res.body.data;

            expect(updatedMessage.viewed).toBeTruthy();
        });

        it("should get a 404 not found error", async () => {
            const res = await request.put("/api/messages/abcefabcefabcefabcefabce");
            
            const { errors } = res.body;

            expect(errors).toEqual(
                [
                    {
                        status: 404,
                        message: "The message abcefabcefabcefabcefabce doesn't exist"
                    }
                ]
            );
        });
    });

    describe("Reply Message", () => {
        it("should send an email", async () => {
            const sendMail = jest.fn();
            transporter.sendMail.mockImplementation(sendMail);

            const res = await request
                .post(`/api/messages/replyMessage`)
                .send({ email: "test@gmail.com", message: "Test message" });

            expect(res.body.data.message).toBe("The message has been sent successfully");

            expect(sendMail).toHaveBeenCalledWith({
                from: "example@gmail.com",
                to: "test@gmail.com",
                subject: "Reply Fernando Vaca Tamayo",
                html: "template name: messageReply"
            });
        });
    });
});