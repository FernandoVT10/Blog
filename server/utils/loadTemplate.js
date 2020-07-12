import path from "path";
import fs from "fs";

export default (templateName, params) => {
    const url = path.join(__dirname, `../templates/${templateName}.html`);
    const buffer = fs.readFileSync(url);
    let template = buffer.toString();

    Object.keys(params).forEach(key => {
        const regex = new RegExp(`{${key}}`, "g");
        template = template.replace(regex, params[key]);
    });

    return template;
};