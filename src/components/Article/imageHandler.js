import Api from "../../ApiController";

export default (editor) => {
    return () => {
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
                        const range = editor.getSelection();
                        
                        editor.insertEmbed(
                            range.index,
                            "image",
                            `http://localhost:3000/img/articles/content/${data.imageName}`
                        );
                    }
                });
            }
        };
    }
}