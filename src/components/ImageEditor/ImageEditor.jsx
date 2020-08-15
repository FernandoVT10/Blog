import { useState, useEffect } from "react";

import "./ImageEditor.scss";

export default ({ image, onChangeImage }) => {
    const [imageURL, setImageURL] = useState("");

    useEffect(() => {
        if(image) {
            setImageURL(image);
        }
    }, [image]);

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
        className="image-editor"
        style={{
            background: `url(${imageURL})`
        }}>
            <label
            htmlFor="image-editor-input"
            className="image-editor__label">
                <i className="fas fa-image" aria-hidden="true"></i>
            </label>

            <input
            type="file"
            id="image-editor-input"
            onChange={changeImage}
            className="image-editor__input" />
        </div>
    );
}