import { useEffect, useState } from "react";

export default ({ editArticle, onChangeTitle, title }) => {
    const [localTitle, setLocalTitle] = useState("");

    const onChange = () => {
        const textarea = document.getElementById("article-edit-title");
        textarea.style.height = 0;
        textarea.style.height = textarea.scrollHeight + "px";

        setLocalTitle(textarea.value);
        onChangeTitle(textarea.value);
    };

    useEffect(() => {
        if(editArticle) {
            window.addEventListener("resize", onChange);

            return () => window.removeEventListener("resize", window);
        }
    }, []);

    if(editArticle) {
        const value = localTitle ? localTitle : title;

        return (
            <textarea
            className="article__edit-title"
            id="article-edit-title"
            onChange={onChange}
            value={value}
            maxLength="50">
            </textarea>
        );
    }

    return <h1 className="article__title">{ title }</h1>;
};