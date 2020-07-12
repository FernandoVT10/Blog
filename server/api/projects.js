import Skill from "../models/Skill";
import Project from "../models/Project";
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
    const { skill } = req.query;
    
    try {
        const options = {};

        if(skill) {
            const skillDocument = await Skill.findOne({ name: skill });

            Object.assign(options, { skills: skillDocument });
        }

        const projects = await Project.find(options).populate("skills");

        res.json({ data: { projects } });
    } catch {
        res.json({ data: { projects: [] } });
    }
});

router.get("/:projectId", async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await Project.findById(projectId).populate("skills");

        if(project) {
            res.json({ data: { project } });
        } else {
            res.json({
                errors: [
                    {
                        status: 404,
                        message: `The project ${projectId} doesn't exist`
                    }
                ]
            });
        }
    } catch (error) {
        res.json({ errors: [error] });
    }
});

export default router;