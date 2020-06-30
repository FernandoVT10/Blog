import Layout from "../components/Layout";
import Navbar from "../components/Navbar/";
import Footer from "../components/Footer/";
import ArticleCardList from "../components/Articles/ArticleCardList";

export default () => {
    return (
        <Layout title="Articles - Fernando Blog">
            <Navbar/>

            <div className="body">
                <ArticleCardList/>
            </div>

            <Footer/>
        </Layout>
    );
};