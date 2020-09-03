import SkillCard from "./SkillCard";
import AddSkill from "./AddSkill";

import ApiController from "../../../../services/ApiController";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import "./SkillList.scss";

const SkillList =  () => {
    const [skills, setSkills] = useState([]);
    const [isActive, setIsActive] = useState(false);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        ApiController.get("skills")
        .then(res => {
            if(res.data) {
                setSkills(res.data.skills);
            }
            
            setLoading(false);
        });
    }, []);

    const deleteSkill = skillId => {
        ApiController.delete(`skills/${skillId}`)
        .then(res => {
            if(!res.errors) {
                setSkills(
                    skills.filter(skill => skill._id !== skillId)
                );
            }
        });
    }

    const updateSkillName = (skillId, skillName) => {
        ApiController.put(`skills/${skillId}`, { name: skillName }, true)
        .then(res => {
            if(res.data) {
                setSkills(skills.map(skill => {
                    if(skill._id === skillId) {
                        return res.data.updatedSkill;
                    }
                    
                    return skill;
                }));
            }
        });
    }

    const getSkills = () => {
        if(loading) {
            return (
                <div className="admin-skill-list__loader">
                    <span className="spinner-border"></span>
                </div>
            );
        }

        if(!skills.length) {
            return (
                <div className="custom-table__not-found">
                    No skills available.
                </div>
            );
        }

        return skills.map(skill => {
            return (
                <SkillCard
                deleteSkill={deleteSkill}
                updateSkillName={updateSkillName}
                skill={skill}
                key={skill._id} />
            );
        });
    };

    const handleAddNewButton = (url) => {
        router.push(router.pathname, `/admin/projects/${url}`);
    }

    const addNewMenuClass = isActive ? "admin-skill-list__add-new-menu--active" : "";

    return (
        <div className="custom-table">
            <div className="custom-table__header">
                <div className="custom-table__header-title">
                    Skill List
                </div>

                <div className="custom-table__header-filter-container">
                    <button
                    className="admin-skill-list__add-button"
                    onClick={() => setIsActive(!isActive)}>
                        <i className="fas fa-plus"></i>
                    </button>

                    <div className="admin-skill-list__add-new-menu-container">
                        <div className={`admin-skill-list__add-new-menu ${addNewMenuClass}`}>
                            <span
                            className="admin-skill-list__add-new-menu-item"
                            onClick={() => handleAddNewButton("addProject")}>
                                Add New Project
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="admin-skill-list">
                <div className="custom-table">
                    <div className="custom-table__body">
                        { getSkills() }
                        
                        <AddSkill setSkills={setSkills}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SkillList;