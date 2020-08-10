import Skill from "../models/Skill";
import Project from "../models/Project";

import jwtAuthentication from "../utils/jwtAuthentication";

import { Router } from "express";
import { uploadImages, deleteImage } from "../utils/imageUpload";

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

router.post("/", jwtAuthentication, uploadImages("images", "/projects/"), async (req, res) => {
    const { title, description, skills } = req.body;
    
    try {
        const skillDocuments = await Skill.find({ name: skills });

        const images = req.files.map(image => image.filename);

        const createdProject = await Project.create({
            title,
            description,
            images,
            skills: skillDocuments
        });

        res.json({
            data: { createdProject }
        });
    } catch(error) {
        req.files.forEach(image => {
            deleteImage(`/projects/${image.filename}`);
        });

        res.json({ errors: [ error ] });
    }
});

router.put("/:projectId", jwtAuthentication, uploadImages("images", "/projects/"), async (req, res) => {
    const { projectId } = req.params;
    const { title, description, skills } = req.body;
    
    try {
        const project = await Project.findById(projectId);
        
        if(project) {
            const oldImages = project.images;

            const skillDocuments = await Skill.find({ name: skills });

            project.title = title;
            project.description = description;
            project.skills = skillDocuments;

            if(req.files.length) {
                const images = req.files.map(image => image.filename);
                project.images = images;
            }

            const updatedProject = await project.save();

            if(req.files.length) {
                oldImages.forEach(image => {
                    deleteImage(`/projects/${image}`);
                });
            }

            res.json({
                data: { updatedProject }
            });
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
    } catch(error) {
        req.files.forEach(image => {
            deleteImage(`/projects/${image.filename}`);
        });

        res.json({ errors: [ error ] });
    }
});

router.delete("/:projectId", jwtAuthentication, async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await Project.findById(projectId);

        if(project) {
            project.images.forEach(image => {
                deleteImage(`/projects/${image}`);
            });
    
            const deletedProject = await project.remove();
    
            res.json({
                data: { deletedProject }
            });
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