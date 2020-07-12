import { Router } from "express";
import Subscription from "../models/Subscription";
import transporter from "../config/mail";
import loadTemplate from "../utils/loadTemplate";
import { DOMAIN } from "../config/constants";

const router = Router();

router.post("/", async (req, res) => {
    const { email } = req.body;
    
    try {
        if(!await Subscription.exists({ email })) {
            const subscription = await Subscription.create({ email });

            const HTMLTemplate = loadTemplate("subscription", {
                url: DOMAIN,
                subscriptionId: subscription._id
            });

            await transporter.sendMail({
                from: "example@gmail.com",
                to: email,
                subject: "Confirm your subscription to Fernando Vaca Tamayo Blog",
                html: HTMLTemplate
            });

            transporter.close();
        }

        res.json({
            data: {
                message: "An email was just sent to confirm your subscription"
            }
        });
    } catch (error) {
        res.json({ errors: [error] });
    }
});

router.put("/:subscriptionId/confirm/", async (req, res) => {
    const { subscriptionId } = req.params;

    try {
        const subscription = await Subscription.findById(subscriptionId);

        if(subscription) {
            subscription.active = true;
            subscription.save();

            res.json({ 
                data: {
                    message: "You have successfully subscribed"
                }
            });
        } else {
            res.json({ 
                errors: [
                    {
                        status: 404,
                        message: "The subscription doesn't exists"
                    }
                ]
            });
        }
    } catch (error) {
        res.json({ errors: [error] });
    }
});

export default router;