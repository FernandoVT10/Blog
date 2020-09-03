import ApiController from "@/services/ApiController";
import ProjectCard from "./ProjectCard";

import { useEffect, useState } from "react";

import "./ProjectCardList.scss";

const ProjectCardList = ({ skillName, isActive }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(isActive && !projects.length) {
            setLoading(true);

            ApiController.get(`projects?skill=${skillName}`)
            .then(res => {
                if(res.data) {
                    setProjects(res.data.projects);
                }

                setLoading(false);
            });
        }
    }, [isActive]);

    const deleteProject = (projectId) => {
        ApiController.delete(`projects/${projectId}`)
        .then(res => {
            if(!res.errors) {
                setProjects(projects.filter(
                    project => project._id !== projectId
                ));
            }
        });
    }

    if(loading) {
        return (
            <div className="admin-skill-list-project-card-list__loader">
                <span className="spinner-border"></span>
            </div>
        );
    }

    if(!projects.length) {
        return (
            <div className="admin-skill-list-project-card-list__not-found">
                There are not projects with the { skillName } skill.
            </div>
        );
    }

    return projects.map(project => {
        return <ProjectCard 
                key={project._id}
                deleteProject={deleteProject}
                project={project} />;
    });
}

export default ProjectCardList;