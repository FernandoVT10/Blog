import "../styles/components/comment.scss";

export default ({ comment }) => {
    return (
        <div className="comment">
            <p className="comment__name">
                { comment.name }
            </p>
            <p className="comment__content">
                { comment.comment }
            </p>
        </div>
    );
};