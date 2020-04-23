import Article from "../models/Article";
import Category from "../models/Category";
import { Router } from "express";

const router = Router();

router.get("/getRecent/:limit", async (req, res) => {
    const limit = parseInt(req.params.limit);

    try {
        const articles = await Article.find()
        .sort({ createdAt: "desc" })
        .limit(limit);

        res.json(articles);
    } catch (error) {
        console.log(error);

        res.json([]);
    }
});

router.get("/getArticleById/:articleId", async (req, res) => {
    const { articleId } = req.params;

    try {
        const article = await Article.findById(articleId).populate("categories");

        res.json(article);
    } catch (error) {
        console.log(error);

        res.json({});
    }
});

export default router;