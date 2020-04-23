import Comment from "../models/Comment";
import Article from "../models/Article";
import { Router } from "express";

const router = Router();

router.get("/getComments/:articleId/:limit/:skip", async (req, res) => {
    const { articleId } = req.params;
    const limit = parseInt(req.params.limit) || 0;
    const skip = parseInt(req.params.skip) || 0;

    try {
        const comments = await Comment.find({ articleId })
                            .sort({ createdAt: "desc" })
                            .limit(limit)
                            .skip(skip);

        res.json(comments);
    } catch (error) {
        console.log(error);

        res.json([]);
    }
});

router.post("/addComment/", async (req, res) => {
    const { articleId, name, comment } = req.body;

    try {
        if(!await Article.exists({ _id: articleId })) {
            // we check if exist the article
            res.json({ status: false, error: {
                message: "The article doesn't exists"
            }});
            return;
        }

        const createdComment = await Comment.create({ articleId, name, comment });

        res.json( {
            status: true,
            createdComment
        });
    } catch (error) {
        res.json({ status: false, error: error });
    }
});

export default router;