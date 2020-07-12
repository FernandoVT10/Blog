import jwtAuthentication from "../utils/jwtAuthentication";
import User from "../models/User";
import { JWT_SECRET_KEY, PASSWORD_SALT } from "../config/constants";
import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/isLogged/", jwtAuthentication, async (req, res) => {
    try {
        if(await User.exists({ _id: req.userId })) {
            res.json({ data: { isLogged: true } });
        } else {
            res.json({ data: { isLogged: false } });
        }
    } catch {
        res.json({ data: { isLogged: false } });
    }
});

// router.post("/register/", async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         if(password) {
//             const passwordHash = bcrypt.hashSync(password, PASSWORD_SALT);

//             await User.create({ username, password: passwordHash });

//             res.json({ status: true, message: "You have successfully registered" });
//         } else {
//             res.json({ status: false, error: {
//                 message: "The parameter password is required"
//             } });
//         }
//     } catch (error) {
//         res.json({ status: false, error });
//     }
// });

router.post("/login/", async (req, res) => {
    const { username, password } = req.body;

    if(!username || !password) {
        res.json({
            errors: [
                {
                    status: 200,
                    message: "The username and password are required"
                }
            ]
        });

        return;
    }

    try {
        const user = await User.findOne({ username });

        if(user) {
            if(bcrypt.compareSync(password, user.password)) {

                const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY);

                res.json({
                    data: {
                        message: "You successfully logged in",
                        token
                    }
                });

            } else {
                res.json({
                    errors: [
                        {
                            status: 200,
                            message: "The username or password are incorrect"
                        }
                    ]
                });
            }
        } else {
            res.json({
                errors: [
                    {
                        status: 404,
                        message: "The username doesn't exist"
                    }
                ]
            });
        }
    } catch (error) {
        res.json({ errors: [error] });
    }
});

export default router;