import next from "next";
import mongoose from "mongoose";
import app from "./app";
import { dayTimeOut } from "./utils/timeOuts";

mongoose.connect("mongodb://localhost/fernandoblog", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
    app.get("*", (req, res) => {
        return handle(req, res);
    });

    app.listen(3000, () => console.log("Server running on http://localhost:3000"));
});

dayTimeOut();