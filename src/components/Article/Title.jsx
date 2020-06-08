import { useEffect, useState } from "react";

export default ({ editArticle, onChangeTitle, title }) => {
    const [localTitle, setLocalTitle] = useState("");

    useEffect(() => {
        window.addEventListener("resize", onChange);

        return () => window.removeEventListener("resize", window);
    }, []);

    useEffect(() => {
        setLocalTitle(title);
    }, [editArticle]);

    const onChange = () => {
        const textarea = document.getElementById("article-edit-title");
        
        if(textarea) {
            textarea.style.height = 0;
            textarea.style.height = textarea.scrollHeight + "px";

            setLocalTitle(textarea.value);
            onChangeTitle(textarea.value);
        }
    };

    if(editArticle) {
        return (
            <div>
                <textarea
                className="article__edit-title"
                id="article-edit-title"
                onChange={onChange}
                value={localTitle}
                maxLength="50"
                required>
                </textarea>
                <span className="article__edit-title-error">
                    <i className="fas fa-info-circle" aria-hidden="true"></i>
                    The title is required.
                </span>
            </div>
        );
    }

    return <h1 className="article__title">{ localTitle }</h1>;
};