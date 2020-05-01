import Skill from "../models/Skill";
import { Router } from "express";

const router = Router();

router.get("/getAllSkills/", async (req, res) => {
    try {
        const skills = await Skill.find();

        res.json(skills);
    } catch (error) {
        console.log(error);
        
        res.json([]);
    }
});

export default router;