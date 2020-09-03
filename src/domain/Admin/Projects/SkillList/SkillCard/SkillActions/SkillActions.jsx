import ConfirmModal from "@/components/ConfirmModal";

import { useState } from "react";

const SkillActions = ({ skill, deleteSkill, setIsEditing }) => {
    const [confirmModalActive, setConfirmModalActive] = useState(false);

    const onClose = confirm => {
        if(confirm) {
            deleteSkill(skill._id);
        }

        setConfirmModalActive(false);
    }

    return (
        <div>
            <ConfirmModal
            active={confirmModalActive}
            message={`Are you sure to delete "${skill.name}"?`}
            prefix={skill._id}
            onClose={onClose} />

            <button
            className="custom-table__button custom-table__button--edit"
            onClick={() => setIsEditing(true)}>
                <i className="fas fa-edit" aria-hidden="true"></i>
            </button>

            <button
            className="custom-table__button custom-table__button--delete"
            onClick={() => setConfirmModalActive(true)}>
                <i className="fas fa-times" aria-hidden="true"></i>
            </button>
        </div>
    );
}

export default SkillActions;