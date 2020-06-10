import Layout from "../../components/Layout/";
import Navbar from "../../components/Navbar/";
import Footer from "../../components/Footer/";
import Article from "../../components/Article";
import CommentList from "../../components/CommentList/CommentList";
import Api from "../../ApiController";

import "../../styles/pages/article.scss";

function ArticlePage({ article }) {
    return (
        <Layout title={`${article.title} - Fernando Blog`}>
            <Navbar/>

            <Article article={article} />

            <CommentList articleId={article._id} />

            <Footer/>
        </Layout>
    );
};

ArticlePage.getInitialProps = async ({ query }) => {
    const article = await Api.get(`articles/getArticleById/${query.articleId}`);

    return { article };
}

export default ArticlePage;