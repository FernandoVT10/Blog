import { useEffect, useRef } from "react";
import Api from "../../ApiController";

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
                imageHandler,
                theme: "snow"
            });

            function imageHandler() {
                const input = document.createElement("input");
                input.setAttribute("type", "file");
                input.click();

                input.onchange = () => {
                    const file = input.files[0];

                    if(file.type === "image/png"
                    || file.type === "image/jpg"
                    || file.type === "image/jpeg"
                    || file.type === "image/gif") {
                        const formData = new FormData();
                        formData.append("image", file);

                        Api.post("images/uploadImage", formData, true, true)
                        .then(data => {
                            if(data.status) {
                                const range = editor.current.getSelection();
                                
                                editor.current.insertEmbed(
                                    range.index,
                                    "image",
                                    `http://localhost:3000/img/articles/content/${data.imageName}`
                                );
                            }
                        });
                    }
                };
            }

            editor.current.getModule("toolbar").addHandler("image", imageHandler);

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
    }, [editArticle]);

    return (
        <div>
            <div id="content-editor" className="article__content-editor">
            </div>
        </div>
    );
};