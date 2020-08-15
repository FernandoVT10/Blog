import ArticleEditor from "./ProjectEditor";

import Modal from "../../../../components/Modal";

import ApiController from "../../../../services/ApiController";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [skills, setSkills] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [modalActive, setModalActive] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const addProject = () => {
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

        imageFiles.forEach(
            imageFile => formData.append("images", imageFile)
        );

        skills.forEach(
            skill => formData.append("skills", skill)
        );

        ApiController.post("projects/", formData, true, true)
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
        title="Add Project"
        active={modalActive}
        onClose={onCloseModal}
        prefix="add-project">
            <ArticleEditor
            loading={loading}
            projectNotFound={false}
            title={title}
            setTitle={setTitle}
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
            currentImages={[]}
            images={[]}
            description={description}
            setDescription={setDescription}
            skills={skills}
            setSkills={setSkills}
            errorMessage={errorMessage}
            handleButton={addProject}
            setModalActive={setModalActive} />
        </Modal>
    );
}