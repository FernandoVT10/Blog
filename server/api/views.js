import PermanentViews from "../models/PermanentViews";
import Article from "../models/Article";
import jwtAuthentication from "../utils/jwtAuthentication";
import paginate from "../utils/paginate";

import { Router } from "express";
import Category from "../models/Category";

const router = Router();

router.get("/getTotalViews/", jwtAuthentication, async (_, res) => {
    try {
        const views = await Article.aggregate([
            {
                $group: {
                    _id: null,
                    day: { $sum: "$dayViews" },
                    month: { $sum: "$monthViews" },
                    total: { $sum: "$totalViews" }
                }
            }
        ]);

        res.json(views[0]);
    } catch (error) {
        console.log(error);

        res.json({});
    }
});

router.get("/getViewsHistory/:type/:limit", jwtAuthentication, async (req, res) => {
    const type = req.params.type;
    const limit = parseInt(req.params.limit) || 1;

    try {
        const views = await PermanentViews.find({ type })
            .sort({ createdAt: "desc" })
            .limit(limit);

        res.json(views);
    } catch (error) {
        console.log(error);

        res.json([]);
    }
});

router.get("/getMostViewedArticles/:type/:limit", jwtAuthentication, async (req, res) => {
    const limit = parseInt(req.params.limit) || 1;
    const type = req.params.type;

    try {
        const views = await Article.aggregate([
            {
                $project: {
                    _id: "$article._id",
                    cover: "$cover",
                    title: "$title",
                    views: `$${type}Views`,
                }
            }
        ]).sort({ views: "desc" }).limit(limit);

        res.json(views);
    } catch (error) {
        console.log(error);
        
        res.json([]);
    }
});

router.get("/getArticles/", jwtAuthentication, async (req, res) => {
    const { search, categories } = req.query;
    const limit = parseInt(req.query.limit) || 6;
    const offset = parseInt(req.query.offset) || 1;
    const sort = req.query.sort || "day";
    const options = {};

    try {
        if(search) {
            Object.assign(options, { title: { $regex: `.*(?i)${search}.*` } });
        }

        if(categories) {
            const categoriesDocument = await Category.find({ name: categories });

            const categoriesIds = categoriesDocument.map(category => category._id);
            
            Object.assign(options, { categories: { $all: categoriesIds } });
        }

        const articles = await Article.aggregate([
            { $match: options },
            {
                $project: {
                    _id: "$article._id",
                    cover: "$cover",
                    title: "$title",
                    dayViews: "$dayViews",
                    monthViews: "$monthViews",
                    totalViews: "$totalViews",
                    sortViews: `$${sort}Views`
                }
            },
            { $sort: { sortViews: -1 } },
            { $skip: (offset - 1) * limit },
            { $limit: limit }
        ]);

        const totalArticles = await Article.find(options).countDocuments();

        const totalPages = Math.ceil(totalArticles / limit);

        const pagination = paginate(totalPages, offset);

        res.json({
            articles,
            pagination
        });
    } catch (error) {
        console.log(error);

        res.json({});
    }
});

export default router;