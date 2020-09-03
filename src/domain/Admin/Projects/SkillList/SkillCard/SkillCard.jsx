import SkillActions from "./SkillActions";
import ProjectCardList from "./ProjectCardList";

import SkillInput from "../SkillInput";

import { useState } from "react";

import "./SkillCard.scss";

const SkillCard =  ({ skill, deleteSkill, updateSkillName }) => {
    const [skillName, setSkillName] = useState(skill.name);
    const [isActive, setIsActive] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const handleForm = e => {
        e.preventDefault();

        updateSkillName(skill._id, skillName);
        setIsEditing(false);
    }

    const handleOnBlur = () => {
        setIsEditing(false);
        setSkillName(skill.name);
    }

    const iconClass = isActive ? "fa-folder-open" : "fa-folder";
    const titleClass = isActive ? "admin-skill-list-skill-card__title-active" : "";
    const projectListClass = isActive ? "admin-skill-list-skill-card__project-list--active" : "";

    if(isEditing) {
        return (
            <SkillInput
            onSubmit={handleForm}
            skillName={skillName}
            setSkillName={setSkillName}
            onBlur={handleOnBlur}/>
        );
    }

    return (
        <div className="admin-skill-list-skill-card custom-table__body-row">
            <div className="admin-skill-list-skill-card__title">
                <span
                onClick={() => setIsActive(!isActive)}
                className={`custom-table__article__title ${titleClass}`}>
                    <i className={`fas mr-2 ${iconClass}`}></i>
                    { skill.name }
                </span>

                <div className="admin-skill-list-skill-card__skill-actions">
                    <SkillActions
                    skill={skill}
                    deleteSkill={deleteSkill}
                    setIsEditing={setIsEditing}/>
                </div>
            </div>

            <div className={`admin-skill-list-skill-card__project-list ${projectListClass}`}>
                <ProjectCardList skillName={skill.name} isActive={isActive}/>
            </div>
        </div>
    );
}

export default SkillCard;