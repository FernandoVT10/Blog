import SkillList from "./SkillList";

import EditProject from "./ProjectEditor/EditProject";
import AddProject from "./ProjectEditor/AddProject";

import AddSkill from "./SkillEditor/AddSkill";
import EditSkill from "./SkillEditor/EditSkill";

import { useRouter } from "next/router";

export default () => {
    const router = useRouter();

    const options = router.query.options || [];

    const getModals = () => {
        if(options[0] === "addProject") {
            return <AddProject/>;
        }

        if(options[0] === "addSkill") {
            return <AddSkill/>;
        }

        if(options[1] === "edit") {
            return <EditProject projectId={options[0]}/>;
        }

        if(options[1] === "editSkill") {
            return <EditSkill skillId={options[0]}/>
        }
    }

    return (
        <div>
            { getModals() }

            <SkillList/>
        </div>
    );
}