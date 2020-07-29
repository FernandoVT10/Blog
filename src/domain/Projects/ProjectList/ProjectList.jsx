import Modal from "../Modal";
import ProjectCard from "./ProjectCard";

import ApiController from "../../../services/ApiController";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";

import "./ProjectList.scss";

export default () => {
    const [modalActive, setModalActive] = useState(false);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);

    const currentSkill = useRef();

    const router = useRouter();

    useEffect(() => {
        const { skill, project } = router.query;

        if(project) {
            setModalActive(false);
        } else if(skill && !loading && currentSkill.current !== skill) {
            currentSkill.current = skill;
            setLoading(true);
            setModalActive(true);

            ApiController.get(`projects?skill=${skill}`)
            .then(res => {
                if(res.data) {
                    setProjects(res.data.projects);
                }

                setLoading(false);
            });
        } else if(skill) {
            setModalActive(true);
        }
    }, [router.query]);

    const getProjects = () => {
        if(loading) {
            return (
                <div className="col-12 project-list__loader">
                    <span className="spinner-border"></span>
                </div>
            );
        }

        if(!projects.length) {
            return (
                <div className="col-12 project-list__not-available">
                    There are not projects available
                </div>
            );
        }

        return projects.map(project => { 
            return (
                <div className="col-12 col-lg-6 mb-3" key={project._id}>
                    <ProjectCard project={project} />
                </div>
            );
        });
    };

    const onCloseModal = () => {
        setModalActive(false);

        const searchParams = new URLSearchParams(window.location.search);

        if(!searchParams.has("project")) {
            router.push({
                pathname: router.pathname,
                query: {}
            });
        } else {
            // when the modal is closed, we add the modal-open class to the body
            document.body.classList.add("modal-open");
        }
    };

    return (
        <Modal
        title={currentSkill.current}
        active={modalActive}
        onClose={onCloseModal}
        prefix="project-list">
            <div className="container-fluid p-0">
                <div className="row">
                    { getProjects() }
                </div>
            </div>
        </Modal>
    );
};