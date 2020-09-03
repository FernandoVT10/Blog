import SkillList from "./SkillList";

import EditProject from "./ProjectEditor/EditProject";
import AddProject from "./ProjectEditor/AddProject";

import { useRouter } from "next/router";

const Projects =  () => {
    const router = useRouter();

    const options = router.query.options || [];

    const getModals = () => {
        if(options[0] === "addProject") {
            return <AddProject/>;
        }

        if(options[1] === "edit") {
            return <EditProject projectId={options[0]}/>;
        }
    }

    return (
        <div>
            { getModals() }

            <SkillList/>
        </div>
    );
}

export default Projects;