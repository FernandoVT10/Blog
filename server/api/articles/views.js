import PermanentViews from "../../models/PermanentViews";
import Article from "../../models/Article";

import jwtAuthentication from "../../utils/jwtAuthentication";

import { Router } from "express";

const router = Router();

router.get("/views/", jwtAuthentication, async (req, res) => {
    const type = req.query.type || "day";
    const limit = parseInt(req.query.limit) || 1;

    try {
        const views = await PermanentViews.find({ type })
            .sort({ createdAt: "desc" })
            .limit(limit);

        res.json({ data: { views } });
    } catch {
        res.json({ data: { views: [] } });
    }
});

router.get("/views/getTotalViews/", jwtAuthentication, async (_, res) => {
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

        const viewsObject = views[0];

        if(viewsObject.total) {
            res.json({ data: { views: views[0] } });
        } else {
            res.json({
                data: {
                    views: {
                        _id: null,
                        day: 0,
                        month: 0,
                        total: 0
                    }
                }
            });
        }
    } catch {
        res.json({
            data: {
                views: {
                    _id: null,
                    day: 0,
                    month: 0,
                    total: 0
                }
            }
        });
    }
});

export default router;