import Skill from "../models/Skill";
import Project from "../models/Project";
import { Router } from "express";

const router = Router();

router.get("/getProjectsBySkillName/:name", async (req, res) => {
    const {name} = req.params;
    
    try {
        const skill = await Skill.findOne({ name });

        const projects = await Project.find({ skills: skill });

        res.json(projects);
    } catch (error) {
        console.log(error);

        res.json([]);
    }
});

router.get("/getProjectById/:projectId", async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId).populate("skills");

        res.json(project);
    } catch (error) {
        console.log(error);

        res.json({});
    }
});

export default router;