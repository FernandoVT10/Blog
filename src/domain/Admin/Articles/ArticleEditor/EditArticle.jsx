import Title from "./Title";
import Content from "./Content";
import Description from "./Description";
import Categories from "./Categories";

import ImageEditor from "../../../../components/ImageEditor";

import ApiController from "../../../../services/ApiController";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import "./ArticleEditor.scss";

export default ({ articleId }) => {
    const [coverFile, setCoverFile] = useState();
    const [cover, setCover] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [description, setDescription] = useState("");
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [articleNotFound, setArticleNotFound] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const router = useRouter();

    useEffect(() => {
        if(articleId) {
            ApiController.get(`articles/${articleId}/`)
            .then(res => {
                if(res.data) {
                    const { article } = res.data;

                    setCover(article.cover);
                    setTitle(article.title);
                    setContent(article.content);
                    setDescription(article.description);

                    setCategories(article.categories.map(
                        category => category.name
                    ));
                } else {
                    setArticleNotFound(true);
                }

                setLoading(false);
            });
        }
    }, []);

    const updateArticle = () => {
        if(!title) {
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

        categories.forEach(category => {
            formData.append("categories", category);
        });

        if(coverFile) {
            formData.append("cover", coverFile);
        }

        setIsUpdating(true);

        ApiController.put(`articles/${articleId}/`, formData, true, true)
        .then(res => {
            if(!res.errors) {
                router.push({
                    pathname: router.pathname,
                    query: {}
                });
            } else {
                setErrorMessage(res.errors[0].message);
            }

            setIsUpdating(false);
        });
    }

    if(loading) {
        return (
            <div className="article-editor">
                <div className="article-editor__loader">
                    <span className="spinner-border"></span>
                </div>
            </div>
        );
    }

    if(articleNotFound) {
        return (
            <div className="article-editor">
                <div className="article-editor__not-found">
                    The article doesn't exist
                    <Link href="?">
                        <a className="article-editor__not-found-link">
                            View all articles
                        </a>
                    </Link>    
                </div>
            </div>
        );
    }

    const loaderClass = isUpdating ? "article-editor__update-loader--active" : "";

    return (
        <div className="article-editor">
            <div className={`article-editor__update-loader ${loaderClass}`}>
                <span className="spinner-border"></span>
            </div>

            <ImageEditor image={`/img/articles/${cover}`} onChangeImage={setCoverFile}/>

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

                <button className="custom-button custom-button--save" onClick={updateArticle}>
                    <i className="fas fa-folder"></i>
                    Save
                </button>

                <Link href="?">
                    <button className="custom-button custom-button--cancel">
                        <i className="fas fa-trash"></i>
                        Cancel
                    </button>
                </Link>
            </div>
        </div>
    );
}