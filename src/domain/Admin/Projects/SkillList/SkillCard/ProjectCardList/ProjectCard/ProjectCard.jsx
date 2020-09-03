import ConfirmModal from "@/components/ConfirmModal";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import "./ProjectCard.scss";

const ProjectCard =  ({ project, deleteProject }) => {
    const [confirmModalActive, setConfirmModalActive] = useState(false);
    const router = useRouter();

    const onClose = (confirm) => {
        if(confirm) {
            deleteProject(project._id);
        }

        setConfirmModalActive(false);
    }
    
    return (
        <div className="admin-skill-list-project-card">
            <ConfirmModal
            active={confirmModalActive}
            message={`Are you sure to delete "${project.title}"?`}
            prefix={project._id}
            onClose={onClose} />

            <Link href={`/projects?project=${project._id}`}>
                <a className="admin-skill-list-project-card__title">
                    { project.title }
                </a>
            </Link>

            <div className="admin-skill-list-project-card__actions">
                <Link href={router.pathname} as={`/admin/projects/${project._id}/edit`}>
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
        </div>
    );
}

export default ProjectCard;