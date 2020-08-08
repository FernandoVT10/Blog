import { useState } from "react";

import "./Cover.scss";

export default ({ cover, onChangeImage }) => {
    const [imageURL, setImageURL] = useState("");

    useState(() => {
        if(cover) {
            setImageURL(`/img/articles/${cover}`);
        }
    }, [cover]);

    const changeImage = ({ target: { files } }) => {
        const file = files[0];

        if(file.type === "image/png"
        || file.type === "image/jpeg"
        || file.type === "image/jpg"
        || file.type === "image/gif") {
            onChangeImage(file);
            setImageURL(URL.createObjectURL(file));
        }
    }

    return (
        <div
        className="article-editor-cover"
        style={{
            background: `url(${imageURL})`
        }}>
            <label
            htmlFor="cover-image"
            className="article-editor-cover__label">
                <i className="fas fa-image" aria-hidden="true"></i>
            </label>

            <input
            type="file"
            id="cover-image"
            onChange={changeImage}
            className="article-editor-cover__input" />
        </div>
    );
}