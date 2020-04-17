import express from "express";
import next from "next";
import routes from "./routes";

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
    const app = express();

    routes(app);

    app.get("*", (req, res) => {
        return handle(req, res);
    });

    app.listen(3000, () => console.log("Server running on http://localhost:3000"));
});