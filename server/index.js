import express from "express";
import next from "next";
import routes from "./routes";
import bodyParser from "body-parser";
import mongoose from "mongoose";

mongoose.connect("mongodb://localhost/fernandoblog", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
    const app = express();
    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    routes(app);

    app.get("*", (req, res) => {
        return handle(req, res);
    });

    app.listen(3000, () => console.log("Server running on http://localhost:3000"));
});