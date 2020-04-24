import Layout from "../../components/Layout";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Comment from "../../components/Comment";
import FullScreenLoader from "../../components/FullScreenLoader";
import Api from "../../ApiController";

import { useState, useEffect } from "react";

import "../../styles/pages/article.scss";

function Comments({ articleId }) {
    const commentsLimit = 10;

    const [comments, setComments] = useState([]);

    // ADD COMMENT
    const [name, setName] = useState("");
    const [comment, setComment] = useState("");

    // LOAD MORE COMMENTS
    const [skip, setSkip] = useState(0);
    const [loadMoreClass, setLoadMoreClass] = useState("comments__load-more--active");
    const [loading, setLoading] = useState(false);

    // GET COMMENTS
    useEffect(() => {
        setLoading(true);

        Api.get(`comments/getComments/${articleId}/${commentsLimit}/${skip}`)
        .then(newComments => {
            if(newComments.length < commentsLimit) {
                setLoadMoreClass("");
            }

            setComments(comments.concat(newComments));
            setLoading(false);
        });
    }, [skip]);

    const addComment = e => {
        e.preventDefault();
        e.target.reset();

        setLoading(true);

        Api.post("comments/addComment/", {
            articleId,
            name,
            comment
        }).then(data => {
            if(data.status) {
                const newComments = [];
                comments.forEach(comment => newComments.push(comment));
                newComments.unshift(data.createdComment);

                setComments(newComments);
            }

            setLoading(false);
        });
    };

    return (
        <div className="container-fluid">
            <FullScreenLoader loading={loading}/>
            <div className="row comments">
                <div className="col-12">
                    <h3 className="comments__title">Comments</h3>
                </div>
                <div className="col-12 col-lg-8">
                    <form onSubmit={addComment}>
                        <input
                        type="text"
                        className="formulary__input mb-2"
                        maxLength="30"
                        placeholder="Enter your Name"
                        onChange={({ target: { value } }) => setName(value)}
                        required/>

                        <textarea
                        placeholder="Enter your Message"
                        className="formulary__textarea"
                        onChange={({ target: { value } }) => setComment(value)}
                        maxLength="500"
                        rows="6"
                        required></textarea>

                        <button type="submit" className="submit-button mt-3">
                            Add Comment
                        </button>
                    </form>
                </div>
                <div className="col-12 col-lg-8">
                    {comments.map(comment => {
                        return <Comment key={comment._id} comment={comment} />;
                    })}
                </div>
                <div className="col-12 col-lg-8 d-flex justify-content-center">
                    <button
                    className={`comments__load-more ${loadMoreClass}`}
                    onClick={() => setSkip(skip + commentsLimit)}>
                        Load more comments
                    </button>
                </div>
            </div>
        </div>
    );
}

function Article({ article }) {
    const getCategories = () => {
        if(article.categories.length) {
            return (
                <div className="article__categories">
                    <i
                    className="fas fa-tags"
                    aria-hidden="true"></i>

                    <span className="ml-2">
                        {article.categories.map(({ name }, index) => {
                            if(index) {
                                return (
                                    <span key={index}>
                                        , { name }
                                    </span>
                                );
                            } else {
                                return (
                                    <span key={index}>
                                        { name }
                                    </span>
                                );
                            }
                        })}
                    </span>                        
                </div>
            );
        }

        return;
    }

    return (
        <Layout title={`${article.title} - Fernando Blog`}>
            <Navbar/>

            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 article">
                        <img
                        src={`/img/articles/${article.cover}`}
                        className="article__cover"
                        alt={article.title}/>

                        <div className="article__content-container">
                            <h1 className="article__title">{ article.title }</h1>

                            <div
                            className="article__content"
                            dangerouslySetInnerHTML={{__html: article.content}}>
                            </div>

                            { getCategories() }
                        </div>
                    </div>
                </div>
            </div>

            <Comments articleId={article._id}/>

            <Footer/>
        </Layout>
    );
};

Article.getInitialProps = async ({ query }) => {
    const article = await Api.get(`articles/getArticleById/${query.articleId}`);

    return { article };
}

export default Article;