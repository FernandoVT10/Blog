import { useEffect } from "react";

import "./Content.scss";

export default ({ content }) => {
    useEffect(() => {
        async function setupQuill() {
            const quill = await import("quill");

            const editor = new quill.default("#content-editor", {
                modules: {
                    syntax: true,
                    toolbar: false
                },
                readOnly: true,
                theme: "snow"
            });

            try {
                editor.setContents(JSON.parse(content));
            } catch {}
        }

        setupQuill();
    }, []);

    return <div id="content-editor" className="article__content-editor"></div>;
}