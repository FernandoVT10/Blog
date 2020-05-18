import PermanentViews from "../models/PermanentViews";
import ArticleViews from "../models/ArticleViews";
import jwtAuthentication from "../utils/jwtAuthentication";

import { Router } from "express";

const router = Router();

router.get("/getTotalViews/", jwtAuthentication, async (_, res) => {
    try {
        const views = await ArticleViews.aggregate([
            {
                $group: {
                    _id: "$type",
                    views: { $sum: "$views" }
                }
            }
        ]);

        const response = {};

        views.forEach(({ _id, views }) => {
            response[_id] = views;
        });

        res.json(response);
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
        // with Look Up we get the article and with project we structure the response
        const views = await ArticleViews.aggregate([
            { $match: { type } },
            {
                $lookup: {
                    from: "articles",
                    localField: "articleId",
                    foreignField: "_id",
                    as: "article"
                }
            },
            {
                $project: {
                    _id: "$article._id",
                    cover: { $arrayElemAt: ["$article.cover", 0] },
                    title: { $arrayElemAt: ["$article.title", 0] },
                    views: "$views"
                }
            }
        ]).sort({ views: "desc" }).limit(limit);

        res.json(views);
    } catch (error) {
        console.log(error);
        
        res.json([]);
    }
});

export default router;