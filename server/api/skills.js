import Skill from "../models/Skill";
import { Router } from "express";

const router = Router();

router.get("/", async (_, res) => {
    try {
        const skills = await Skill.find();

        res.json({ data: { skills } });
    } catch {
        res.json({ data: { skills: [] } });
    }
});

export default router;