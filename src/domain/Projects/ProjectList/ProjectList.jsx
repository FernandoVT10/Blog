import ProjectCard from "./ProjectCard";

import "./ProjectList.scss";

const ProjectList = ({ projects, loading }) => {
    const getProjects = () => {
        if(loading) {
            return (
                <div className="projects-project-list__container">
                    <span className="spinner-border"></span>
                </div>
            );
        }

        if(!projects.length) {
            return (
                <div className="projects-project-list__container">
                    There are no projects available.
                </div>
            );
        }

        return projects.map(project => {
            return (
                <div className="col-lg-6 my-3" key={project._id}>
                    <ProjectCard project={project}/>
                </div>
            );
        });
    }

    return (
        <div className="container-fluid projects-project-list">
            <div className="row projects-project-list__wrapper">
                <div className="col-12">
                    <h2 className="projects-project-list__title">My Projects</h2>
                </div>

                { getProjects() }
            </div>
        </div>
    );
}

export default ProjectList;