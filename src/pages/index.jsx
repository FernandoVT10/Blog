import Layout from "../components/Layout/";
import Navbar from "../components/Navbar/";
import Footer from "../components/Footer/";
import MainCarousel from "../components/MainCarousel/";
import ArticleCard from "../components/ArticleCard/";
import Api from "../ApiController";

function Index({ articles }) {
    const getArticles = () => {
        if(articles.length) {
            return articles.map(article => {
                return (
                    <div className="col-12 col-lg-6 mt-4" key={article._id}>
                        <ArticleCard article={article}/>
                    </div>
                );
            });
        } else {
            return (
                <div className="col-12 mt-4">
                    <h4 className="m-0 font-weight-bold color-secondary">
                        There is not available articles
                    </h4>
                </div>
            );
        }
    }

    return (
        <Layout>
            <Navbar />

            <MainCarousel />

            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <h2 className="title mt-4">Recent Articles</h2>
                    </div>
                </div>

                <div className="row">
                    { getArticles() }
                </div>
            </div>

            <Footer />
        </Layout>
    );
}

Index.getInitialProps = async () => {
    const articles = await Api.get("articles/getRecent/4");

    return { articles };
}

export default Index;