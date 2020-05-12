import Layout from "../components/Layout/";
import Navbar from "../components/Navbar/";
import Footer from "../components/Footer/";
import SkillCard from "../components/Projects/SkillCard/";
import ProjectsModal from "../components/Projects/ProjectsModal/";
import ProjectModal from "../components/Projects/ProjectModal/";
import Api from "../ApiController";

import "../styles/pages/projects.scss";

function Projects({ skills }) {
    const getSkills = () => {
        if(!skills.length) {
            return (
                <div className="col-12">
                    <h4 className="color-secondary text-center font-weight-bold">
                        There is not skills available
                    </h4>
                </div>
            );
        }

        return skills.map(skill => {
            return (
                <div
                className="col-sm-6 col-md-6 col-lg-4 mb-3"
                key={skill._id}>
                    <SkillCard skill={skill} openProjects={() => {}} />
                </div>
            );
        });
    };

    return (
        <Layout title="Projects - Fernando Blog">
            <Navbar/>

            <ProjectsModal />
            <ProjectModal/>

            <div className="body">
                <div className="container-fluid mt-4">
                    <div className="row projects-container">
                        <div className="col-12">
                            <h2 className="title">Skills</h2>
                        </div>

                        { getSkills() }
                    </div>
                </div>
            </div>

            <Footer/>
        </Layout>
    );
};

Projects.getInitialProps = async () => {
    const skills = await Api.get("skills/getAllSkills/");

    return { skills };
};

export default Projects;