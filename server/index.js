import next from "next";
import mongoose from "mongoose";
import app from "./app";
import { dayTimeOut } from "./utils/timeOuts";
import { config } from "dotenv";
config();

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
    app.get("*", (req, res) => {
        return handle(req, res);
    });

    app.listen(port, () => console.log("Server running"));
});

dayTimeOut();