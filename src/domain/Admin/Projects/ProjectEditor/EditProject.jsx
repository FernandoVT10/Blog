import ArticleEditor from "./ProjectEditor";

import Modal from "../../../../components/Modal";

import ApiController from "../../../../services/ApiController";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default ({ projectId }) => {
    const [title, setTitle] = useState("");
    const [images, setImages] = useState([]);
    const [description, setDescription] = useState("");
    const [skills, setSkills] = useState([]);

    const [imageFiles, setImageFiles] = useState([]);
    const [currentImages, setCurrentImages] = useState([]);

    const [modalActive, setModalActive] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const [projectNotFound, setProjecNotFound] = useState(false);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        ApiController.get(`projects/${projectId}`)
        .then(res => {
            if(res.data) {
                const { project } = res.data;

                setTitle(project.title);
                setImages(project.images);
                setCurrentImages(project.images);
                setDescription(project.description);

                setSkills(project.skills.map(skill => skill.name));
            } else {
                setProjecNotFound(true);
            }

            setLoading(false);
        });
    }, []);

    const editProject = () => {
        if(!title) {
            setErrorMessage("The title is required");
            return;
        } else if(!description) {
            setErrorMessage("The description is required");
            return;
        }

        setErrorMessage("");
        setLoading(true);

        const formData = new FormData();

        formData.append("title", title);
        formData.append("description", description);

        currentImages.forEach(
            image => formData.append("currentImages", image)
        );

        imageFiles.forEach(
            imageFile => formData.append("newImages", imageFile)
        );

        skills.forEach(
            skill => formData.append("skills", skill)
        );

        ApiController.put(`projects/${projectId}`, formData, true, true)
        .then(res => {
            if(!res.errors) {
                router.push("/admin/projects/");
            } else {
                setErrorMessage(res.errors[0].message);
            }

            setLoading(false);
        });
    }

    const onCloseModal = () => {
        setModalActive(false);

        router.push(router.pathname, "/admin/projects/");
    }

    return (
        <Modal
        title="Edit Project"
        active={modalActive}
        onClose={onCloseModal}
        prefix="edit-project">
            <ArticleEditor
            loading={loading}
            projectNotFound={projectNotFound}
            title={title}
            setTitle={setTitle}
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
            currentImages={currentImages}
            setCurrentImages={setCurrentImages}
            images={images}
            description={description}
            setDescription={setDescription}
            skills={skills}
            setSkills={setSkills}
            errorMessage={errorMessage}
            handleButton={editProject}
            setModalActive={setModalActive} />
        </Modal>
    );
}