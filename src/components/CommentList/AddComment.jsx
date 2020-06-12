import Api from "../../ApiController";

import { useState } from "react";

export default ({ articleId, setLoading, addComment }) => {
    const [name, setName] = useState("");
    const [comment, setComment] = useState("");

    const handleForm = e => {
        e.preventDefault();
        e.target.reset();

        setLoading(true);

        Api.post("comments/addComment/", {
            articleId,
            name,
            comment
        }).then(data => {
            if(data.status) {
                addComment(data.createdComment);
            }

            setLoading(false);
        });
    };

    return (
        <form onSubmit={handleForm}>
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
    );
}