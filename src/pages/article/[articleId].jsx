import Layout from "../../components/Layout";
import Navbar from "../../components/Navbar/";
import Footer from "../../components/Footer/";
import Article from "../../domain/Article";
// import CommentList from "../../components/CommentList/CommentList";

function ArticlePage() {
    return (
        <Layout>
            <Navbar/>

            <Article />

            {/* <CommentList articleId={article._id} /> */}

            <Footer/>
        </Layout>
    );
};

// ArticlePage.getInitialProps = async ({ query }) => {
//     const article = await Api.get(`articles/getArticleById/${query.articleId}`);

//     return { article };
// }

export default ArticlePage;