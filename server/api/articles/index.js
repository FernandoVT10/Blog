import Article from "../../models/Article";
import Category from "../../models/Category";
import Comment from "../../models/Comment";

import { Router } from "express";

import paginate from "../../utils/paginate";
import jwtAuthentication from "../../utils/jwtAuthentication";
import { uploadImage, deleteImage } from "../../utils/imageUpload";

import commentsRouter from "./comments";
import viewsRouter from "./views";
import imagesRouter from "./images";

const router = Router();

router.use("/", commentsRouter);
router.use("/", viewsRouter);
router.use("/", imagesRouter);

router.get("/", async (req, res) => {
    const { search, categories } = req.query;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort;
    const paginateParameter = req.query.paginate;

    const options = {};
    const sortOptions = {};

    try {
        if(search) {
            Object.assign(options, { title: { $regex: `.*(?i)${search}.*` } });
        }

        if(categories) {
            const categoriesDocument = await Category.find({ name: categories });
            
            Object.assign(options, { categories: { $all: categoriesDocument } });
        }

        switch (sort) {
            case "dayViews":
                Object.assign(sortOptions, { dayViews: "desc" });
                break;
            
            case "monthViews":
                Object.assign(sortOptions, { monthViews: "desc" });
                break;

            case "totalViews":
                Object.assign(sortOptions, { totalViews: "desc" });
                break;
        
            default:
                Object.assign(sortOptions, { createdAt: "desc" });
                break;
        }

        const skip = (page - 1) * limit;

        const articles = await Article.find(options)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .populate("categories");

        if(paginateParameter === "true" || paginateParameter === undefined) {
            const totalArticles = await Article.find(options).countDocuments();

            const totalPages = Math.ceil(totalArticles / limit);

            const pagination = paginate(totalPages, page);

            res.json({ data: { articles, pagination } });
        } else {
            res.json({ data: { articles } });
        }
    } catch {
        if(paginateParameter === "true" || paginateParameter === undefined) {
            res.json({ data: { articles: [], pagination: null } });
        } else  {
            res.json({ data: { articles: [] } });
        }
    }
});

router.get("/:articleId", async (req, res) => {
    const { articleId } = req.params;

    try {
        const article = await Article.findById(articleId).populate("categories");

        if(article) {
            res.json({ data: { article } });
        } else {
            res.json({
                errors: [
                    {
                        status: 404,
                        message: `The article ${articleId} doesn't exist`
                    }
                ]
            });
        }
    } catch (error) {
        res.json({
            errors: [
                error
            ]
        });
    }
});

router.post("/", jwtAuthentication, uploadImage("cover", "/articles/"), async (req, res) => {
    const { title, content, description, categories } = req.body;
    const cover = req.file;

    try {
        if(cover) {
            const categoriesDocument = await Category.find({ name: categories });

            const createdArticle = await Article.create({
                title,
                content,
                description,
                cover: cover.filename,
                categories: categoriesDocument
            });

            res.json({ data: { createdArticle } });
        } else {
            res.json({
                errors: [
                    {
                        status: 200,
                        message: "The 'cover' field is required"
                    }
                ]
            });
        }
    } catch (error) {
        if(cover) {
            deleteImage(`/articles/${cover.filename}`);
        }

        res.json({ errors: [ error ] });
    }
});

router.put("/:articleId", jwtAuthentication, uploadImage("cover", "/articles/"), async (req, res) => {
    const { articleId } = req.params;
    const { title, content, description, categories } = req.body;
    const cover = req.file;

    try {
        const article = await Article.findById(articleId);
        
        if(article) {
            const oldCover = article.cover;
            const categoriesDocument = await Category.find({ name: categories });

            article.title = title;
            article.content = content;
            article.description = description;
            article.categories = categoriesDocument;

            if(cover) {
                article.cover = cover.filename;
            }

            const updatedArticle = await article.save();

            if(cover) {
                deleteImage(`/articles/${oldCover}`);
            }

            res.json({ data: { updatedArticle } });
        } else {
            res.json({
                errors: [
                    {
                        status: 404,
                        message: `The article ${articleId} doesn't exist`
                    }
                ]
            });
        }
    } catch (error) {
        res.json({ errors: [ error ] });
    }
});

router.delete("/:articleId", jwtAuthentication, async (req, res) => {
    const { articleId } = req.params;

    try {
        const article = await Article.findById(articleId);

        if(article) {
            await Comment.deleteMany({ articleId: article._id });

            deleteImage(`/articles/${article.cover}`);
            
            const deletedArticle = await article.remove();

            res.json({ data: { deletedArticle } });
        } else {
            res.json({
                errors: [
                    {
                        status: 404,
                        message: `The article ${articleId} doesn't exist`
                    }
                ]
            });
        }
    } catch (error) {
        res.json({
            errors: [ error ]
        });
    }
});

export default router;