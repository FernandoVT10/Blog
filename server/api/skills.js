import Skill from "../models/Skill";

import jwtAuthentication from "../utils/jwtAuthentication";
import { uploadImage, deleteImage } from "../utils/imageUpload";

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

router.post("/", jwtAuthentication, uploadImage("image", "/skills/"), async (req, res) => {
    const { name, color } = req.body;
    const image = req.file;

    try {
        if(image) {
            const createdSkill = await Skill.create({
                name,
                color,
                image: image.filename
            });

            res.json({
                data: { createdSkill }
            });
        } else {
            res.json({
                errors: [
                    {
                        status: 200,
                        message: "The 'image' field is required"
                    }
                ]
            });
        }
    } catch (error) {
        if(image) {
            deleteImage(`/skills/${image.filename}`);
        }

        res.json({ errors: [error] });
    }
});

router.put("/:skillId", jwtAuthentication, uploadImage("image", "/skills/"), async (req, res) => {
    const { skillId } = req.params;
    const { name, color } = req.body;
    const image = req.file;

    try {
        const skill = await Skill.findById(skillId);

        if(skill) {
            const oldImage = skill.image;
    
            skill.name = name;
            skill.color = color;
    
            if(image) {
                skill.image = image.filename;
            }
    
            const updatedSkill = await skill.save();
    
            if(image) {
                deleteImage(`/skills/${oldImage}`);
            }
    
            res.json({
                data: { updatedSkill }
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
        if(image) {
            deleteImage(`/skills/${image.filename}`);
        }

        res.json({ errors: [error] });
    }
});

router.delete("/:skillId", jwtAuthentication, async (req, res) => {
    const { skillId } = req.params;

    try {
        const skill = await Skill.findById(skillId);

        if(skill) {
            deleteImage(`/skills/${skill.image}`);
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
        if(image) {
            deleteImage(`/skills/${image.filename}`);
        }

        res.json({ errors: [error] });
    }
});

export default router;