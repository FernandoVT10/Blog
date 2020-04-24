import Layout from "../components/Layout/";
import Navbar from "../components/Navbar/";
import Footer from "../components/Footer/";
import ArticlesFilter from "../components/ArticleFilter/";

import "../styles/pages/articles.scss";

export default () => {
    return (
        <Layout title="Articles - Fernando Blog">
            <Navbar/>

            <div className="articles-container container-fluid">
                <div className="row mt-4">
                    <div className="col-12 articles-container__header">
                        <div className="row">
                            <div className="col-6 col-sm-6 col-lg-8">
                                <h2 className="title">Articles</h2>
                            </div>
                            <div className="col-sm-6 col-lg-4">
                                <ArticlesFilter/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer/>
        </Layout>
    );
};