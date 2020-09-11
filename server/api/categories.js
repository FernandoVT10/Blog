import Category from "../models/Category";

import jwtAuthentication from "../utils/jwtAuthentication";

import { Router } from "express";

const router = Router();

router.get("/", async (_, res) => {
    try {
        const categories = await Category.find();

        res.json({ data: { categories } });
    } catch {
        res.json({ data: { categories: [] } });
    }
});

router.post("/", jwtAuthentication, async (req, res) => {
    const { name } = req.body;

    try {
        const createdCategory = await Category.create({ name });

        res.json({
            data: { createdCategory }
        });
    } catch (error) {
        res.json({ errors: [error] });
    }
});

router.put("/:categoryId", jwtAuthentication, async (req, res) => {
    const { categoryId } = req.params;
    const { name } = req.body;

    try {
        const category = await Category.findById(categoryId);

        if(category) {
            category.name = name;

            res.json({
                data: { updatedCategory: await category.save() }
            });
        } else {
            res.json({
                errors: [
                    {
                        status: 404,
                        message: `The category ${categoryId} doesn't exist`
                    }
                ]
            });
        }
    } catch(error) {
        res.json({ errors: [error] });
    }
});

router.delete("/:categoryId", jwtAuthentication, async (req, res) => {
    const { categoryId } = req.params;

    try {
        const category = await Category.findById(categoryId);

        if(category) {
            res.json({
                data: { deletedCategory: await category.remove() }
            });
        } else {
            res.json({
                errors: [
                    {
                        status: 404,
                        message: `The category ${categoryId} doesn't exist`
                    }
                ]
            });
        }
    } catch(error) {
        res.json({ errors: [error] });
    }
});

export default router;