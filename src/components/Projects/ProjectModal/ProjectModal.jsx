import Modal from "../../Modal";
import Loader from "../../Loader/";
import ProjectCarousel from "./ProjectCarousel";
import Api from "../../../ApiController";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import "./ProjectModal.scss";

export default () => {
    const [project, setProject] = useState({ title: "Loading..." });
    const [modalActive, setModalActive] = useState(false);
    const [loading, setLoading] = useState(true);
    const [projectId, setProjectId] = useState(null);

    const router = useRouter();

    const activeModal = () => {
        setModalActive(true);
            setLoading(false);

        // add z-index to the project modal
        document.getElementById("project-modal").style.zIndex = 1060;

        setTimeout(() => {
            // add z-index to the last modal-backdrop
            const backdrops = document.querySelectorAll(".modal-backdrop");

            backdrops[backdrops.length - 1].style.zIndex = 1059;
        }, 0);
    }

    useEffect(() => {
        if(router.query.project) {
            if(projectId === router.query.project) {
                activeModal();
            } else {
                setLoading(true);
                setProjectId(router.query.project);

                Api.get(`projects/getProjectById/${router.query.project}`)
                .then(project => {
                    if(!project) {
                        return;
                    }

                    setProject(project);
                    activeModal();
                });
            }
        } else {
            setModalActive(false);
        }
    }, [router.query]);

    const onCloseModal = () => {
        setModalActive(false);

        const query = new URLSearchParams(location.search);

        // when the modal is closed, we add the modal-open class to the body
        document.body.classList.add("modal-open");

        router.push({
            pathname: router.pathname,
            query: { skill: query.get("skill") }
        });
    };

    const getProject = () => {
        if(loading) {
            return (
                <Loader active={true} />
            );
        }
        

        return (
            <div className="col-12">
                <ProjectCarousel project={project} />

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
        title={`${project.title}`}
        active={modalActive}
        modalSize="modal-lg"
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