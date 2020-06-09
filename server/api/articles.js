import Article from "../models/Article";
import Category from "../models/Category";

import { Router } from "express";

import paginate from "../utils/paginate";
import jwtAuthentication from "../utils/jwtAuthentication";
import { uploadImage, deleteImage } from "../utils/imageUpload";

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

router.post("/updateArticle/", jwtAuthentication, uploadImage("cover", "/articles/"), async (req, res) => {
    const { articleId, title, content, description, categories } = req.body;
    const cover = req.file;

    try {
        const article = await Article.findById(articleId);
        const categoriesDocument = await Category.find({ name: categories });

        article.title = title;
        article.content = content;
        article.description = description;
        article.categories = categoriesDocument;

        if(cover) {
            deleteImage(`/articles/${article.cover}`);

            article.cover = cover.filename;
        }

        const newArticle = await article.save();
        res.json({ status: true, newArticle });
    } catch (error) {
        res.json({ status: false, error });
    }
});

router.delete("/deleteArticle/", jwtAuthentication, async (req, res) => {
    const { articleId } = req.body;

    try {
        await Article.deleteOne({ _id: articleId });

        res.json({ status: true, message: "The article has been deleted successfully" });
    } catch (error) {
        res.json({ status: false, error });
    }
});

export default router;