import { Router } from "express";
import Suscribe from "../models/Suscribe";
import validate from "../utils/validate";
import transporter from "../config/mail";
import { isValidObjectId } from "mongoose";

const router = Router();

router.post("/suscribe/", async (req, res) => {
    const { email } = req.body;

    if(validate.email(email)) {
        if(!await Suscribe.exists({ email })) {
            const suscription = await Suscribe.create({ email });

            await transporter.sendMail({
                from: "example@gmail.com",
                to: email,
                subject: "Confirm your suscription to Fernando Vaca Tamayo Blog",
                html: `
                <a href="http://localhost:3000/confirm-suscription/${suscription._id}">
                    Holi
                </a>
                `
            });

            transporter.close();
        }

        res.json({ status: true, message: "An email was just sent to confirm your subscription" });
    } else {
        res.json({ status: false, message: "The email is invalid" });
    }
});

router.post("/suscribe/confirm/", async (req, res) => {
    const { subscriptionId } = req.body;

    if(subscriptionId) {
        if(isValidObjectId(subscriptionId)) {
            const suscription = await Suscribe.findById(subscriptionId);

            if(suscription) {
                suscription.active = true;
                suscription.save();

                res.json({ status: true, message: "You have successfully subscribed" });
            } else {
                res.json({ status: false, message: "The suscription doesn't exists" });
            }
        } else {
            res.json({ status: false, message: "The suscription doesn't exists" });
        }
    } else {
        res.json({ status: false, message: "The subscriptionId paramater is required" });
    }
});

export default router;