import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config/constants";

export default (req, res, next) => {
    const bearerHeader = req.headers["authorization"];

    if(typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];

        try {
            const data = jwt.verify(token, JWT_SECRET_KEY);

            req.userId = data.userId;

            next();
        } catch {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(403);
    }
};