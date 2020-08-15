import ApiController from "../../../../../services/ApiController";

import { useEffect, useState } from "react";

import "./SkillList.scss";

export default ({ skills, setSkills }) => {
    const [allSkills, setAllSkills] = useState([]);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        ApiController.get("skills")
        .then(res => {
            if(res.data) {
                setAllSkills(res.data.skills.map(skill => {
                    if(skills.includes(skill.name)) {
                        return {
                            name: skill.name,
                            active: true
                        }
                    }

                    return {
                        name: skill.name,
                        active: false
                    }
                }));
            }
        });
    }, []);

    const handleCheckbox = (skill) => {
        setAllSkills(allSkills.map(allSkill => {
            if(allSkill.name === skill.name) {
                allSkill.active = !allSkill.active;
            }

            return allSkill;
        }));

        if(skill.active) {
            setSkills(prevProps => [...prevProps, skill.name]);
        } else {
            setSkills(skills.filter(skillName => skillName !== skill.name));
        }
    }

    const containerClass = isActive ? "project-editor-skill-list__container--active" : "";
    const buttonIconClass = isActive ? "fa-sort-down" : "fas fa-sort-up";

    return (
        <div className="project-editor-skill-list">
            <button
            className="project-editor-skill-list__toggle-button"
            onClick={() => setIsActive(!isActive)}>
                Skills
                <i className={`fas ${buttonIconClass}`}></i>
            </button>

            <div className={`project-editor-skill-list__container ${containerClass}`}>
                {allSkills.map((skill, index) => {
                    return (
                        <div
                        className="project-editor-skill-list__skill"
                        key={index}>
                            <input
                            className="project-editor-skill-list__input"
                            id={`skill-${skill.name}`}
                            onChange={() => handleCheckbox(skill)}
                            type="checkbox"
                            checked={skill.active} />

                            <label
                            className="project-editor-skill-list__label"
                            htmlFor={`skill-${skill.name}`}>
                                { skill.name }
                                <span className="project-editor-skill-list__label-checkbox"></span>
                            </label>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}