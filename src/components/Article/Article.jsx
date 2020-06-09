import Cover from "./Cover";
import Title from "./Title";
import Content from "./Content";
import Categories from "./Categories";
import Description from "./Description";
import Api from "../../ApiController";

import { useState, useEffect } from "react";

import "./Article.scss";

export default (props) => {
    const [coverImage, setCoverImage] = useState();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [description, setDescription] = useState("");
    const [categories, setCategories] = useState([]);

    const [article, setArticle] = useState(props.article);
    const [editArticle, setEditArticle] = useState(false);

    useEffect(() => {
        setTitle(article.title);
        setContent(article.content);
        setDescription(article.description);
        setCategories(article.categories.map(
            category => category.name
        ));
    }, []);

    const saveArticle = () => {
        if(!title.length) {
            return;
        }

        const formData = new FormData();

        formData.append("articleId", article._id);
        formData.append("cover", coverImage);
        formData.append("title", title);
        formData.append("content", content);
        formData.append("description", description);
        formData.append("categories", categories);

        Api.post("articles/updateArticle/", formData, true, true)
        .then(res => {
            if(res.status) {
                const newArticle = res.newArticle;

                setArticle(newArticle);
            }
            setEditArticle(false);
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

                        <Description
                        editArticle={editArticle}
                        description={description}
                        onChangeDescription={setDescription}/>

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