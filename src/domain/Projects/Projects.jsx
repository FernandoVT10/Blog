import ProjectList from "./ProjectList";
import ViewProject from "./ViewProject";

import ApiController from "@/services/ApiController";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [project, setProject] = useState({});
    const [loading, setLoading] = useState(true);

    const currentProjectId = useRef();

    const router = useRouter();

    useEffect(() => {
        ApiController.get("projects")
        .then(res => {
            if(res.data) {
                setProjects(res.data.projects);
            }

            setLoading(false);
        });
    }, []);

    useEffect(() => {
        const projectId = router.query.project;

        if(projectId && projectId !== currentProjectId.current) {
            setLoading(true);
            setProject({});
            currentProjectId.current = projectId;

            ApiController.get(`projects/${projectId}`)
            .then(res => {
                if(res.data) {
                    setProject(res.data.project);
                }
                setLoading(false);
            });
        }
    }, [router.query]);

    if(router.query.project) {
        return <ViewProject project={project} loading={loading} />;
    }

    return <ProjectList projects={projects} loading={loading} />;
}

export default Projects;