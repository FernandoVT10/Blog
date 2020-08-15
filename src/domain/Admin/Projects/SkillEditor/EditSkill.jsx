import SkillEditor from "./SkillEditor";

import Modal from "../../../../components/Modal";

import ApiController from "../../../../services/ApiController";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default ({ skillId }) => {
    const [name, setName] = useState("");
    const [imageFile, setImageFile] = useState();
    const [color, setColor] = useState("#000");

    const [image, setImage] = useState("");

    const [modalActive, setModalActive] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const [skillNotFound, setSkillNotFound] = useState(false);

    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        ApiController.get(`skills/${skillId}`)
        .then(res => {
            if(res.data) {
                const { skill } = res.data;

                setName(skill.name);
                setColor(skill.color);
                setImage(skill.image);
            } else {
                setSkillNotFound(true);
            }

            setLoading(false);
        });
    }, [])

    const editSkill = () => {
        if(!name) {
            setErrorMessage("The name is required");
            return;
        }

        setErrorMessage("");
        setLoading(true);

        const formData = new FormData();

        formData.append("name", name);

        if(imageFile) {
            formData.append("image", imageFile);
        }

        formData.append("color", color);

        ApiController.put(`skills/${skillId}`, formData, true, true)
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
        title="Edit Skill"
        active={modalActive}
        onClose={onCloseModal}
        prefix="edit-skill">
            <SkillEditor
            name={name}
            setName={setName}
            image={`/img/skills/${image}`}
            setImageFile={setImageFile}
            color={color}
            setColor={setColor}
            skillNotFound={skillNotFound}
            loading={loading}
            setModalActive={setModalActive}
            handleButton={editSkill}
            errorMessage={errorMessage}/>
        </Modal>
    );
}