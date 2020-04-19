import articles from "./api/articles";
import suscribe from "./api/suscribe";

export default app => {
    app.use("/api/articles", articles);
    app.use("/api/", suscribe);
};