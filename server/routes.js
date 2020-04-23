import articles from "./api/articles";
import comments from "./api/comments";
import suscribe from "./api/suscribe";

export default app => {
    app.use("/api/articles", articles);
    app.use("/api/comments", comments);
    app.use("/api/", suscribe);
};