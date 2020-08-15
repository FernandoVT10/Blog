import SkillEditor from "./SkillEditor";

import Modal from "../../../../components/Modal";

import ApiController from "../../../../services/ApiController";

import { useState } from "react";
import { useRouter } from "next/router";

export default () => {
    const [name, setName] = useState("");
    const [imageFile, setImageFile] = useState();
    const [color, setColor] = useState("#000");

    const [modalActive, setModalActive] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const addSkill = () => {
        if(!name) {
            setErrorMessage("The name is required");
            return;
        } else if(!imageFile) {
            setErrorMessage("The image is required");
            return;
        }

        setErrorMessage("");
        setLoading(true);

        const formData = new FormData();

        formData.append("name", name);
        formData.append("image", imageFile);
        formData.append("color", color);

        ApiController.post("skills", formData, true, true)
        .then(res => {
            if(!res.errors) {
                setModalActive(false);
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
        title="Add Skill"
        active={modalActive}
        onClose={onCloseModal}
        prefix="add-skill">
            <SkillEditor
            name={name}
            setName={setName}
            image=""
            setImageFile={setImageFile}
            color={color}
            setColor={setColor}
            skillNotFound={false}
            loading={loading}
            setModalActive={setModalActive}
            handleButton={addSkill}
            errorMessage={errorMessage}/>
        </Modal>
    );
}