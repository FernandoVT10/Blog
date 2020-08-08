import { useEffect } from "react";

import "./Title.scss"

export default ({ title, onChangeTitle }) => {
    const onChange = () => {
        const textarea = document.getElementById("article-editor-title");
        
        if(textarea) {
            textarea.style.height = 0;
            textarea.style.height = textarea.scrollHeight + "px";

            onChangeTitle(textarea.value);
        }
    }

    useEffect(() => {
        window.addEventListener("resize", onChange);

        return () => window.removeEventListener("resize", window);
    }, []);

    return (
        <textarea
        className="article-editor-title"
        id="article-editor-title"
        onChange={onChange}
        value={title}
        placeholder="Enter a title"
        maxLength="50"
        required>
        </textarea>
    );
};