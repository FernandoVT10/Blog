import Layout from "@/components/Layout";
import Navbar from "@/components/Navbar/";
import Footer from "@/components/Footer/";

import Projects from "@/domain/Projects";

const ProjectsPage = () => {
    return (
        <Layout title="Projects - Fernando Blog">
            <Navbar/>

            <div className="body">
                <Projects/>
            </div>

            <Footer/>
        </Layout>
    );
}

export default ProjectsPage;