import Modal from "../../Modal";
import ProjectCard from "../ProjectCard/";
import Api from "../../../ApiController";
import Loader from "../../Loader/";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

export default () => {
    const [modalActive, setModalActive] = useState(false);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [skill, setSkill] = useState(null);
    const modalProjectIsActive = useRef();

    const router = useRouter();

    useEffect(() => {
        const querySkill = router.query.skill;
        const queryProject = router.query.project;

        if(queryProject) {
            modalProjectIsActive.current = true;
        } else {
            modalProjectIsActive.current = false;
        }
        
        if(querySkill && !queryProject) {
            if(skill === querySkill) {
                setModalActive(true);
            } else {
                setSkill(querySkill);
                setLoading(true);

                Api.get(`projects/getProjectsBySkillName/${querySkill}`)
                .then(projects => {
                    setProjects(projects);
                    setModalActive(true);
                    setLoading(false);
                });
            }
        } else {
            setModalActive(false);
        }
    }, [router.query]);

    const onCloseModal = () => {
        if(!modalProjectIsActive.current) {
            router.push({
                pathname: router.pathname,
                query: {}
            });
        } else {
            // when the modal is closed, we add the modal-open class to the body
            document.body.classList.add("modal-open");
        }
    };

    const getProjects = () => {
        if(loading) {
            return (
                <Loader active={true} />
            );
        }

        if(!projects.length) {
            return (
                <div className="col-12">
                    <h4 className="color-secondary text-center font-weight-bold">
                        There is not available projects
                    </h4>
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

    return (
        <Modal
        title={`${router.query.skill} Projects`}
        active={modalActive}
        modalSize="modal-xl"
        onClose={onCloseModal}
        prefix="projects">
            <div className="container-fluid p-0">
                <div className="row">
                    { getProjects() }
                </div>
            </div>
        </Modal>
    );
}