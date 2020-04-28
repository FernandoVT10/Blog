import Category from "../models/Category";
import { Router } from "express";

const router = Router();

router.get("/getAllCategories/", async (_, res) => {
    try {
        const categories = await Category.find();

        res.json(categories);
    } catch (error) {
        console.log(error);

        res.json([]);
    }
});

export default router;