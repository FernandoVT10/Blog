import articles from "./api/articles";
import categories from "./api/categories";
import comments from "./api/comments";
import suscribe from "./api/suscribe";

export default app => {
    app.use("/api/articles", articles);
    app.use("/api/categories", categories);
    app.use("/api/comments", comments);
    app.use("/api/", suscribe);
};