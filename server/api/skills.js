import Skill from "../models/Skill";

import jwtAuthentication from "../utils/jwtAuthentication";

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

router.post("/", jwtAuthentication, async (req, res) => {
    const { name } = req.body;

    try {
        const createdSkill = await Skill.create({ name });

        res.json({
            data: { createdSkill }
        });
    } catch (error) {
        res.json({ errors: [error] });
    }
});

router.put("/:skillId", jwtAuthentication, async (req, res) => {
    const { skillId } = req.params;
    const { name } = req.body;

    try {
        const skill = await Skill.findById(skillId);

        if(skill) {
            skill.name = name;
    
            res.json({
                data: { updatedSkill: await skill.save() }
            });
        } else {
            res.json({
                errors: [
                    {
                        status: 404,
                        message: `The skill ${skillId} doesn't exist`
                    }
                ]
            });
        }
    } catch (error) {
        res.json({ errors: [error] });
    }
});

router.delete("/:skillId", jwtAuthentication, async (req, res) => {
    const { skillId } = req.params;

    try {
        const skill = await Skill.findById(skillId);

        if(skill) {
            const deletedSkill = await skill.remove();
    
            res.json({
                data: { deletedSkill }
            });
        } else {
            res.json({
                errors: [
                    {
                        status: 404,
                        message: `The skill ${skillId} doesn't exist`
                    }
                ]
            });
        }
    } catch (error) {
        res.json({ errors: [error] });
    }
});

export default router;