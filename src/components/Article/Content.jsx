import { useEffect, useRef } from "react";

export default ({ editArticle, content, onChangeContent }) => {
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
                theme: "snow"
            });

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
        }

        setupQuill();
    }, []);

    useEffect(() => {
        if(editor.current) {
            const toolbar = document.querySelector(".ql-toolbar");
            
            if(editArticle) {
                editor.current.enable();
                toolbar.classList.remove("disabled");
            } else {
                editor.current.disable();
                toolbar.classList.add("disabled");
            }
        }
    }, [editArticle]);

    return (
        <div>
            <div id="content-editor" className="article__content-editor">
            </div>
        </div>
    );
};