import articles from "./api/articles";
import categories from "./api/categories";
import comments from "./api/comments";
import skills from "./api/skills";
import projects from "./api/projects";
import messages from "./api/messages";
import users from "./api/users";
import suscribe from "./api/suscribe";

export default app => {
    app.use("/api/articles", articles);
    app.use("/api/categories", categories);
    app.use("/api/comments", comments);
    app.use("/api/skills", skills);
    app.use("/api/projects", projects);
    app.use("/api/messages", messages);
    app.use("/api/users", users);
    app.use("/api/", suscribe);
};