import imageHandler from "../../../../../services/editor/imageHandler";

import { useEffect, useRef } from "react";

import "./Content.scss";

export default ({ content, onChangeContent }) => {
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
                readOnly: false,
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

            try {
                editor.current.setContents(JSON.parse(content));
            } catch (error) { }
        }

        setupQuill();
    }, []);

    return <div id="content-editor" className="article-editor-content"></div>;
};