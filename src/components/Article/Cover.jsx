import { useState, useCallback } from "react";

export default ({ editArticle, onChangeImage, cover }) => {
    const [imageURL, setImageURL] = useState("");

    const changeImage = useCallback(({ target: { files } }) => {
        const file = files[0];

        if(file.type === "image/png"
        || file.type === "image/jpeg"
        || file.type === "image/jpg") {
            onChangeImage(file);
            setImageURL(URL.createObjectURL(file));
        }
    });

    const backgroundURL = imageURL ? imageURL : `/img/articles/${cover}`;

    if(editArticle) {
        return (
            <div
            className="article__cover article__cover--edit"
            style={{
                background: `url(${backgroundURL})`
            }}>
                <label
                htmlFor="cover-image"
                className="article__cover__label">
                    <i className="fas fa-image" aria-hidden="true"></i>
                </label>

                <input
                type="file"
                id="cover-image"
                onChange={changeImage}
                className="article__cover__input" />
            </div>
        );
    }

    return (
        <div
        className="article__cover"
        style={{
            background: `url(${backgroundURL})`
        }}></div>
    );
};