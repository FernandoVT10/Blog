import ProjectCard from "./ProjectCard";
import SkillActions from "./SkillActions";

import ApiController from "../../../../../services/ApiController";

import { useState } from "react";

import "./SkillCard.scss";

export default ({ skill, deleteSkill }) => {
    const [projects, setProjects] = useState([]);
    const [isActive, setIsActive] = useState(false);

    const [loading, setLoading] = useState(false);

    const loadProjects = () => {
        setLoading(true);

        ApiController.get(`projects?skill=${skill.name}`)
        .then(res => {
            if(res.data) {
                setProjects(res.data.projects);
            }

            setLoading(false);
        });
    }

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

    const toggleProjectList = () => {
        if(!projects.length) {
            loadProjects();
        }

        setIsActive(!isActive);
    }

    const getProjects = () => {
        if(loading) {
            return (
                <div className="admin-skill-list-skill-card__loader">
                    <span className="spinner-border"></span>
                </div>
            );
        }

        if(!projects.length) {
            return (
                <div className="admin-skill-list-skill-card__not-found">
                    There are not projects with the { skill.name } skill.
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

    const iconClass = isActive ? "fa-folder-open" : "fa-folder";
    const titleClass = isActive ? "admin-skill-list-skill-card__title-active" : "";
    const projectListClass = isActive ? "admin-skill-list-skill-card__project-list--active" : "";

    return (
        <div className="admin-skill-list-skill-card custom-table__body-row">
            <div className="admin-skill-list-skill-card__title">
                <span
                onClick={toggleProjectList}
                className={`custom-table__article__title ${titleClass}`}>
                    <i className={`fas mr-2 ${iconClass}`}></i>
                    { skill.name }
                </span>

                <div className="admin-skill-list-skill-card__skill-actions">
                    <SkillActions skill={skill} deleteSkill={deleteSkill}/>
                </div>
            </div>

            <div className={`admin-skill-list-skill-card__project-list ${projectListClass}`}>
                { getProjects() }
            </div>
        </div>
    );
}