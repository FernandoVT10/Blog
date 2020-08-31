import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import "./ProjectCard.scss";

const ProjectCard =  ({ project }) => {
    const [imageActive, setImageActive] = useState(0);
    
    const router = useRouter();

    useEffect(() => {
        const interval = setTimeout(() => {
            setImageActive((imageActive + 1) % project.images.length);
        }, 4000);

        return () => {
            clearInterval(interval);
        };
    }, [imageActive]);

    const handleClick = () => {
        const { query } = router;

        Object.assign(query, { project: project._id });

        router.push({
            pathname: router.pathname,
            query
        });
    };

    return (
        <div className="projects-project-card" onClick={handleClick}>
            {project.images.map((image, index) => {
                const projectClass = imageActive === index ? "projects-project-card__image--active" : "";

                return (
                    <img
                    src={`/img/projects/${image}`}
                    className={`projects-project-card__image ${projectClass}`}
                    alt={project.title}
                    key={index} />
                );
            })}
        </div>
    );
};

export default ProjectCard;