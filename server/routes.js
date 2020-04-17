import articles from "./api/articles";

export default app => {
    app.use("/api/articles", articles);
};