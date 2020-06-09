import React from "react";

export default ({ editArticle, onChangeDescription, description }) => {
    const onChange = ({ target: { value } }) => onChangeDescription(value);

    if(!editArticle) {
        return null;
    }

    return (
        <textarea
        className="article__description"
        placeholder="Enter a description"
        maxLength="250"
        onChange={onChange}
        rows="3">{ description }</textarea>
    );
}