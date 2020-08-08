import React from "react";

import "./Description.scss";

export default ({ description, onChangeDescription }) => {
    return (
        <textarea
        className="article-editor-description"
        placeholder="Enter a description"
        maxLength="250"
        onChange={({ target: { value } }) => onChangeDescription(value)}
        value={description}
        rows="3"></textarea>
    );
}