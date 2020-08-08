import ApiController from "../ApiController";

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

                ApiController.post("articles/uploadImage", formData, true, true)
                .then(res => {
                    if(res.data) {
                        const range = editor.getSelection();
                        
                        editor.insertEmbed(
                            range.index,
                            "image",
                            `/img/articles/content/${res.data.imageName}`
                        );
                    }
                });
            }
        };
    }
}