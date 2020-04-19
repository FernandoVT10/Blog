import { Router } from "express";
import Suscribe from "../models/Suscribe";
import validate from "../utils/validate";
import transporter from "../config/mail";

const router = Router();

router.post("/suscribe/", async (req, res) => {
    const { email } = req.body;

    if(validate.email(email)) {
        if(!await Suscribe.exists({ email })) {
            await Suscribe.create({ email });

            await transporter.sendMail({
                from: "example@gmail.com",
                to: email,
                subject: "You have suscribed to Fernando Vaca Tamayo Blog",
                html: "<h1>Holi</h1>"
            });

            transporter.close();
        }

        res.json({ status: true, message: "You have successfully subscribed" });
    } else {
        res.json({ status: false, message: "The email is invalid" });
    }
});

export default router;