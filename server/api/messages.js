import { Router } from "express";
import Message from "../models/Message";

import transporter from "../config/mail";
import { DOMAIN } from "../config/constants";

import jwtAuthentication from "../utils/jwtAuthentication";
import loadTemplate from "../utils/loadTemplate";

const router = Router();

router.get("/", jwtAuthentication, async (_, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: "desc" });

        res.json({ data: { messages } });
    } catch {
        res.json({ data: { messages: [] } });
    }
});

router.get("/pendingMessages/", jwtAuthentication, async (_, res) => {
    try {
        const count = await Message.find({ viewed: false }).countDocuments();

        res.json({ data: { count } });
    } catch {
        res.json({ data: { count: 0 } });
    }
});

router.post("/", async (req, res) => {
    const { email, message } = req.body;

    try {
        await Message.create({ email, message });

        const HTMLTemplate = loadTemplate("messageSent", {
            url: DOMAIN
        });

        await transporter.sendMail({
            from: "example@gmail.com",
            to: email,
            subject: "I have received your message",
            html: HTMLTemplate
        });

        transporter.close();

        res.json({ data: { message: "Your message has been sent successfully" } });
    } catch (error) {
        res.json({ errors: [error] });
    }
});

router.put("/:messageId", jwtAuthentication, async (req, res) => {
    const { messageId } = req.params;
    const { viewed } = req.body;

    try {
        const message = await Message.findById(messageId);

        if(message) {
            message.viewed = viewed;

            const updatedMessage = await message.save();

            res.json({ data: { updatedMessage } });
        } else {
            res.json({
                errors: [
                    {
                        status: 404,
                        message: `The message ${messageId} doesn't exist`
                    }
                ]
            });
        }
    } catch (error) {
        res.json({ errors: [error] });
    }
});

router.post("/replyMessage/", async (req, res) => {
    const { email, message } = req.body;

    try {
        const HTMLTemplate = loadTemplate("messageReply", {
            url: DOMAIN,
            message
        });

        await transporter.sendMail({
            from: "example@gmail.com",
            to: email,
            subject: "Reply Fernando Vaca Tamayo",
            html: HTMLTemplate
        });

        transporter.close();

        res.json({ data: { message: "The message has been sent successfully" } });
    } catch (error) {
        res.json({ errors: [error] });
    }
});

export default router;