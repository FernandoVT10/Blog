import articles from "./api/articles";
import categories from "./api/categories";
import skills from "./api/skills";
import projects from "./api/projects";
import messages from "./api/messages";
import users from "./api/users";
import subscribe from "./api/subscribe";

export default app => {
    app.use("/api/articles", articles);
    app.use("/api/categories", categories);
    app.use("/api/skills", skills);
    app.use("/api/projects", projects);
    app.use("/api/messages", messages);
    app.use("/api/users", users);
    app.use("/api/subscribe", subscribe);
};