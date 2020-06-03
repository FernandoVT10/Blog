import Cover from "./Cover";
import Title from "./Title";
import Content from "./Content";
import Categories from "./Categories";
import Api from "../../ApiController";

import { useState } from "react";

import "./Article.scss";

export default ({ article }) => {
    const [coverImage, setCoverImage] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [categories, setCategories] = useState([]);
    const [editArticle, setEditArticle] = useState(false);

    const saveArticle = () => {
        Api.post("articles/updateArticle/", {
            title,
            content,
            categories,
            cover: coverImage
        }, true)
        .then(res => {
            
        });
    };

    const getFloatButtons = () => {
        if(editArticle) {
            return (
                <div className="article__buttons-container">
                    <button
                    className="article__float-button"
                    onClick={saveArticle}>
                        <i className="fas fa-folder-open" aria-hidden="true"></i>
                    </button>

                    <button
                    className="article__float-button article__float-button--cancel"
                    onClick={() => setEditArticle(false)}>
                        <i className="fas fa-times" aria-hidden="true"></i>
                    </button>
                </div>
            );
        }

        return (
            <div className="article__buttons-container">
                <button
                className="article__float-button"
                onClick={() => setEditArticle(true)}>
                    <i className="fas fa-pencil-alt" aria-hidden="true"></i>
                </button>
            </div>
        );
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 article">
                    <Cover
                    editArticle={editArticle}
                    cover={article.cover}
                    onChangeImage={setCoverImage}/>

                    <div className="article__content-container">
                        <Title
                        editArticle={editArticle}
                        title={article.title}
                        onChangeTitle={setTitle}/>
                        
                        <Content
                        editArticle={editArticle}
                        content={article.content}
                        onChangeContent={setContent}/>

                        <Categories
                        editArticle={editArticle}
                        categories={article.categories}
                        onChangeCategories={setCategories}/>
                    </div>
                </div>

                { getFloatButtons() }
            </div>
        </div>
    );
};