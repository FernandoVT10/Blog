import FullScreenLoader from "../FullScreenLoader";
import Comment from "./Comment";
import AddComment from "./AddComment";
import Api from "../../ApiController";

import { useState, useEffect } from "react";

import "./CommentList.scss";

const COMMENTS_LIMIT = 10;

export default ({ articleId }) => {
    const [comments, setComments] = useState([]);

    // LOAD MORE COMMENTS
    const [skip, setSkip] = useState(0);
    const [loadMoreClass, setLoadMoreClass] = useState("comments__load-more--active");
    const [loading, setLoading] = useState(false);

    // GET COMMENTS
    useEffect(() => {
        setLoading(true);

        Api.get(`comments/getComments/${articleId}/${COMMENTS_LIMIT}/${skip}`)
        .then(newComments => {
            if(newComments.length < COMMENTS_LIMIT) {
                setLoadMoreClass("");
            }

            setComments([...comments, ...newComments]);
            setLoading(false);
        });
    }, [skip]);

    const addComment = newComment => {
        setComments([newComment, ...comments]);;
    };

    return (
        <div className="container-fluid">
            <FullScreenLoader loading={loading}/>

            <div className="row comment-list">
                <div className="col-12">
                    <h3 className="comment-list__title">Comments</h3>
                </div>
                <div className="col-12 col-lg-8">
                    <AddComment
                    articleId={articleId}
                    setLoading={setLoading}
                    addComment={addComment} />
                </div>
                <div className="comment-list__container col-12 col-lg-8">
                    {comments.map(comment => {
                        return <Comment key={comment._id} comment={comment} />;
                    })}
                </div>
                <div className="col-12 col-lg-8 d-flex justify-content-center">
                    <button
                    className={`comment-list__load-more ${loadMoreClass}`}
                    onClick={() => setSkip(skip + COMMENTS_LIMIT)}>
                        Load more comments
                    </button>
                </div>
            </div>
        </div>
    );
}