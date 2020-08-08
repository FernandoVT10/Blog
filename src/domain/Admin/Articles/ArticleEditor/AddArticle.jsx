import Cover from "./Cover";
import Title from "./Title";
import Content from "./Content";
import Description from "./Description";
import Categories from "./Categories";

import ApiController from "../../../../services/ApiController";

import { useState } from "react";

import "./ArticleEditor.scss";

export default ({ setAddArticle }) => {
    const [coverFile, setCoverFile] = useState();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [description, setDescription] = useState("");
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const updateArticle = () => {
        if(!coverFile) {
            setErrorMessage("The cover is required");
            return;
        } else if(!title) {
            setErrorMessage("The title is required");
            return;
        } else if(!description) {
            setErrorMessage("The description is required");
            return;
        }

        setErrorMessage("");

        const formData = new FormData();

        formData.append("title", title);
        formData.append("content", content);
        formData.append("description", description);
        formData.append("cover", coverFile);

        categories.forEach(category => {
            formData.append("categories", category);
        });

        setLoading(true);

        ApiController.post("articles", formData, true, true)
        .then(res => {
            if(!res.errors) {
                setAddArticle(false);
            } else {
                setErrorMessage(res.errors[0].message);
            }

            setLoading(false);
        });
    }

    const loaderClass = loading ? "article-editor__update-loader--active" : "";

    return (
        <div className="article-editor">
            <div className={`article-editor__update-loader ${loaderClass}`}>
                <span className="spinner-border"></span>
            </div>

            <Cover cover="" onChangeImage={setCoverFile}/>

            <div className="article-editor__wrapper">
                <Title title={title} onChangeTitle={setTitle} />

                <Content content={content} onChangeContent={setContent}/>

                <Description description={description} onChangeDescription={setDescription}/>

                <Categories categories={categories} onChangeCategories={setCategories}/>

                { errorMessage &&
                    <p className="formulary__message formulary__message--error">
                        <i className="fas fa-times-circle mr-2" aria-hidden="true"></i>
                        { errorMessage }
                    </p>
                }

                <button className="article-editor__button" onClick={updateArticle}>
                    <i className="fas fa-folder"></i>
                    Save
                </button>

                <button
                className="article-editor__button article-editor__button--cancel"
                onClick={() => setAddArticle(false)}>
                    <i className="fas fa-trash"></i>
                    Cancel
                </button>
            </div>
        </div>
    );
}