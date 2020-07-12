import Comment from "../../models/Comment";
import Article from "../../models/Article";
import { Router } from "express";

const router = Router();

router.get("/:articleId/comments", async (req, res) => {
    const { articleId } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    try {
        const comments = await Comment.find({ articleId })
            .sort({ createdAt: "desc" })
            .limit(limit)
            .skip(offset);

        res.json({ data: { comments } });
    } catch {
        res.json({ data: { comments: [] } });
    }
});

router.post("/:articleId/comments", async (req, res) => {
    const { articleId } = req.params;
    const { name, comment } = req.body;

    try {
        if(!await Article.exists({ _id: articleId })) {
            res.json({
                errors: [
                    {
                        status: 404,
                        message: "The article doesn't exist"
                    }
                ]
            });
        } else  {
            const createdComment = await Comment.create({ articleId, name, comment });

            res.json( { data: { createdComment } });
        }
    } catch (error) {
        res.json({ errors: [error] });
    }
});

export default router;