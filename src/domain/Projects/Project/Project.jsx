import Modal from "../Modal";
import ProjectCarousel from "./ProjectCarousel";

import ApiController from "../../../services/ApiController";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import "./Project.scss";

export default () => {
    const [project, setProject] = useState({});
    const [modalActive, setModalActive] = useState(false);
    const [loading, setLoading] = useState(false);

    const projectId = useRef();

    const router = useRouter();

    useEffect(() => {
        const { project } = router.query;

        if(project && !loading && project !== projectId.current) {
            setLoading(true);
            setModalActive(true);
            projectId.current = project;

            ApiController.get(`projects/${project}`)
            .then(res => {
                if(res.data) {
                    setProject(res.data.project);
                }

                setLoading(false);
            });
        } else if(project) {
            setModalActive(true);
        } else {
            setModalActive(false);
        }
    }, [router.query]);

    const onCloseModal = () => {
        setModalActive(false);

        // when the modal is closed, we add the modal-open class to the body
        document.body.classList.add("modal-open");

        const query = {};
        const params = new URLSearchParams(window.location.search);

        if(params.has("skill")) {
            query.skill = params.get("skill");
        }

        router.push({
            pathname: router.pathname,
            query
        });
    };

    const getProject = () => {
        if(loading) {
            return (
                <div className="col-12 project-details__loader">
                    <span className="spinner-border"></span>
                </div>
            );
        }

        if(!project.title) {
            return (
                <div className="col-12 project-details__not-available">
                    The project doesn't exist
                </div>
            );
        }

        return (
            <div className="col-12">
                <ProjectCarousel title={project.title} images={project.images} />

                <p className="project-details__description">
                    { project.description }
                </p>

                <div className="project-details__skills">
                    {project.skills.map(({ _id, name }) => {
                        return( 
                            <Link href={`?skill=${name}`} key={_id}>
                                <span
                                className="badge badge-pill project-details__skill">
                                    { name }
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    };
    
    return (
        <Modal
        title={`${project.title || "...Loading"}`}
        active={modalActive}
        onClose={onCloseModal}
        prefix="project">
            <div className="container-fluid p-0">
                <div className="row project-details">
                    { getProject() }
                </div>
            </div>
        </Modal>
    );
};