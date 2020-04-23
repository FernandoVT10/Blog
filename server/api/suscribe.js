import { Router } from "express";
import Subscription from "../models/Subscription";
import transporter from "../config/mail";

const router = Router();

router.post("/suscribe/", async (req, res) => {
    const { email } = req.body;
    
    try {
        if(!await Subscription.exists({ email })) {
            const subscription = await Subscription.create({ email });

            await transporter.sendMail({
                from: "example@gmail.com",
                to: email,
                subject: "Confirm your subscription to Fernando Vaca Tamayo Blog",
                html: `
                <a href="http://localhost:3000?subscriptionId=${subscription._id}">
                    Holi
                </a>
                `
            });

            transporter.close();
        }

        res.json({ status: true, message: "An email was just sent to confirm your subscription" });
    } catch (error) {
        res.json({ status: false, error });
    }
});

router.post("/suscribe/confirm/", async (req, res) => {
    const { subscriptionId } = req.body;

    try {
        const subscription = await Subscription.findById(subscriptionId);

        if(subscription) {
            subscription.active = true;
            subscription.save();

            res.json({ status: true, message: "You have successfully subscribed" });
        } else {
            res.json({ status: false, error: {
                message: "The subscription doesn't exists"
            } });
        }
    } catch (error) {
        res.json({ status: false, error });
    }
});

export default router;