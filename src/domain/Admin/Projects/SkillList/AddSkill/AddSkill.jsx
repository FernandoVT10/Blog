import SkillInput from "../SkillInput";

import ApiController from "@/services/ApiController";

import { useState } from "react";

import "./AddSkill.scss";

const AddSkill = ({ setSkills }) => {
    const [skillName, setSkillName] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    const addSkill = e => {
        e.preventDefault();

        ApiController.post("skills", { name: skillName }, true)
        .then(res => {
            if(res.data) {
                setSkillName("");
                setIsEditing(false);

                setSkills(prevSkills => {
                    return [...prevSkills, res.data.createdSkill];
                });
            }
        });
    }

    const handleOnBlur = () => {
        setSkillName("");
        setIsEditing(false);
    }

    return (
        <div className="custom-table__body-row">
            { !isEditing
            ? 
                <button
                className="admin-skill-list-add-skill__add-button"
                onClick={() => setIsEditing(true)}>
                    Add New Skill
                </button>
            :
                <SkillInput
                onSubmit={addSkill}
                skillName={skillName}
                setSkillName={setSkillName}
                onBlur={handleOnBlur}/>
            }
        </div>
    );
}

export default AddSkill;