import imageHandler from "./imageHandler";

import { useEffect, useRef, useState } from "react";

export default ({ editArticle, content, onChangeContent }) => {
    const [editorIsLoading, setEditorIsLoading] = useState(true);
    const editor = useRef();

    useEffect(() => {
        async function setupQuill() {
            hljs.configure({
                languages: ["javascript"]
            });

            const quill = await import("quill");

            editor.current = new quill.default("#content-editor", {
                modules: {
                    syntax: true,
                    toolbar: [
                        [{ header: [1, 2, false] }],
                        ["bold", "italic", "underline", "link"],
                        ["image", "code-block"],
                        [{ list: "ordered"}, { list: "bullet" }]
                    ]
                },
                readOnly: !editArticle,
                imageHandler,
                theme: "snow"
            });

            editor.current
                .getModule("toolbar")
                .addHandler("image", imageHandler(editor.current));

            editor.current.on("text-change", () => {
                const content = JSON.stringify(editor.current.getContents().ops);

                onChangeContent(content);
            });

            if(!editArticle) {
                const toolbar = document.querySelector(".ql-toolbar");
                toolbar.classList.add("disabled");
            }

            try {
                editor.current.setContents(JSON.parse(content));
            } catch (error) { }

            setEditorIsLoading(false);
        }

        setupQuill();
    }, []);

    useEffect(() => {
        if(!editorIsLoading) {
            const toolbar = document.querySelector(".ql-toolbar");
            
            if(editArticle) {
                // if the edit article is true, we enable the editor
                editor.current.enable();
                // and we enable the editor toolbar
                toolbar.classList.remove("disabled");
            } else {
                // if the edit article is false, we disable the editor
                editor.current.disable();
                // we hide the editor toolbar
                toolbar.classList.add("disabled");
            }

            try {
                editor.current.setContents(JSON.parse(content));
            } catch (error) { }
        }
    }, [editArticle, editorIsLoading]);

    return (
        <div>
            <div id="content-editor" className="article__content-editor">
            </div>
        </div>
    );
};