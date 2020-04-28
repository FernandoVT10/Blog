import Article from "../models/Article";
import Category from "../models/Category";
import { Router } from "express";
import paginate from "../utils/paginate";

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

router.get("/getFilteredArticles/", async (req, res) => {
    try {
        const { search, categories } = req.query;
        const limit = parseInt(req.query.limit) || 6;
        const offset = parseInt(req.query.offset) || 1;
        const options = {};
        
        if(search) {
            Object.assign(options, { title: { $regex: `.*(?i)${search}.*` } });
        }

        if(categories) {
            const categoriesDocument = await Category.find({ name: categories });
            
            Object.assign(options, { categories: { $all: categoriesDocument } });
        }

        const articles = await Article.find(options)
            .sort({ createdAt: "desc" })
            .skip((offset - 1) * limit)
            .limit(limit);

        const totalArticles = await Article.find(options).countDocuments();

        const totalPages = Math.ceil(totalArticles / limit);

        const pagination = paginate(totalPages, offset);

        res.json({ articles, pagination });
    } catch (error) {
        console.log(error);
        
        res.json({pagination: {}, articles: []});
    }
});

export default router;