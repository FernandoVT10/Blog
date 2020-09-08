import Layout from "../components/Layout";
import Navbar from "../components/Navbar/";
import Footer from "../components/Footer/";

import MainCarousel from "../domain/Home/MainCarousel";
import ArticleList from "../domain/Home/ArticleList/";
import ConfirmSubscription from "../domain/Home/ConfirmSubscription/";

function Index() {
    return (
        <Layout>
            <Navbar />

            <div className="body">
                <ConfirmSubscription/>

                <MainCarousel />

                <ArticleList/>
            </div>

            <Footer />
        </Layout>
    );
}

export default Index;