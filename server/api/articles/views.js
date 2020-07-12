import PermanentViews from "../../models/PermanentViews";
import Article from "../../models/Article";

import { Router } from "express";

const router = Router();

router.get("/views/", async (req, res) => {
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

router.get("/views/getTotalViews/", async (_, res) => {
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

        res.json({ data: { views: views[0] } });
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