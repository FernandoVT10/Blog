import ProjectCarousel from "./ProjectCarousel";

import Link from "next/link";

import "./ViewProject.scss";

const ViewProject = ({ project, loading }) => {
    const getProject = () => {
        if(loading) {
            return (
                <div className="col-12 projects-view-project__container">
                    <span className="spinner-border"></span>
                </div>
            );
        }
    
        if(!project.title) {
            return (
                <div className="col-12 projects-view-project__container">
                    The project doesn't exist.
                </div>
            );
        }

        return (
            <div className="col-12">
                <div className="projects-view-project__title">
                    { project.title }
                </div>

                <div className="projects-view-project__description">
                    { project.description }
                </div>

                <ProjectCarousel title={project.title} images={project.images}/>

                <div className="projects-view-project__skills">
                    {project.skills.map(({ _id, name }) => {
                        return( 
                            <span
                            className="badge badge-pill projects-view-project__skill"
                            key={_id}>
                                { name }
                            </span>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid projects-view-project">
            <div className="row projects-view-project__wrapper">
                <Link href="?">
                    <button className="projects-view-project__close-button">
                        <i className="fas fa-times"></i>
                    </button>
                </Link>
                { getProject() }
            </div>
        </div>
    );
}

export default ViewProject;