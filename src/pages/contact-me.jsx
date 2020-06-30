import Layout from "../components/Layout";
import Navbar from "../components/Navbar/";
import Footer from "../components/Footer/";
import ContactMe from "../components/ContactMe/";

export default () => {
    return (
        <Layout title="Contact Me - Fernando Blog">
            <Navbar/>

            <ContactMe/>

            <Footer/>
        </Layout>
    );
};