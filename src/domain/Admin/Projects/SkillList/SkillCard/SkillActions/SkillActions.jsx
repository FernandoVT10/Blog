import ConfirmModal from "../../../../../../components/ConfirmModal";

import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default ({ skill, deleteSkill }) => {
    const [confirmModalActive, setConfirmModalActive] = useState(false);

    const router = useRouter();

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
            
            <Link
            href={router.pathname}
            as={`/admin/projects/${skill._id}/editSkill`}>
                <button
                className="custom-table__button custom-table__button--edit">
                    <i className="fas fa-edit" aria-hidden="true"></i>
                </button>
            </Link>

            <button
            className="custom-table__button custom-table__button--delete"
            onClick={() => setConfirmModalActive(true)}>
                <i className="fas fa-times" aria-hidden="true"></i>
            </button>
        </div>
    );
}