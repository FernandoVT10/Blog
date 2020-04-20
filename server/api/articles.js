import Article from "../models/Article";
import { Router } from "express";

const router = Router();

router.get("/getRecent/:limit", async (req, res) => {
    const limit = parseInt(req.params.limit);

    const articles = await Article.find()
    .sort({ createdAt: "desc" })
    .limit(limit);

    res.json(articles);
});

export default router;