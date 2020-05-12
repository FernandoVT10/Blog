import { Router } from "express";
import Message from "../models/Message";
import transporter from "../config/mail";

const router = Router();

router.post("/addMessage/", async (req, res) => {
    const { email, message } = req.body;

    try {
        await Message.create({ email, message });

        await transporter.sendMail({
            from: "example@gmail.com",
            to: email,
            subject: "Fernando Vaca Tamayo Blog",
            html: `Your message has been sent successfully`
        });

        transporter.close();

        res.json({ status: true, message: "Your message has been sent successfully" });
    } catch (error) {
        res.json({ status: false, error });
    }
});

export default router;