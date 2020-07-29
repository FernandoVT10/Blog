import Layout from "../components/Layout";
import Navbar from "../components/Navbar/";
import Footer from "../components/Footer/";

import SkillList from "../domain/Projects/SkillList/";
import ProjectList from "../domain/Projects/ProjectList/";
import Project from "../domain/Projects/Project";

export default () => {
    return (
        <Layout title="Projects - Fernando Blog">
            <Navbar/>

            <ProjectList/>
            <Project/>

            <div className="body">
                <SkillList />
            </div>

            <Footer/>
        </Layout>
    );
};