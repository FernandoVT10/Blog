import Content from "./Content";

import ApiController from "../../services/ApiController";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import "./Article.scss";

export default () => {
    const [article, setArticle] = useState({});
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const { articleId } = router.query;

        if(articleId && loading) {
            ApiController.get(`articles/${articleId}`)
            .then(res => {
                if(res.data) {
                    const { title } = res.data.article;
                    window.document.title = `${title} - Fernando Vaca Tamayo Blog`;

                    setArticle(res.data.article);
                }

                setLoading(false);
            });
        }
    }, [router.query]);

    const getCategories = () => {
        if(article.categories.length) {
            return (
                <div className="article__categories">
                    <i className="fas fa-tags" aria-hidden="true"></i>

                    <span className="ml-2">
                        {article.categories.map((category, index) => {
                            return (
                                <Link
                                href={`/articles?categories=${category.name}`}
                                key={index}>
                                    <a className="article__category mr-2">
                                        { category.name }
                                    </a>
                                </Link>
                            );
                        })}
                    </span>
                </div>
            );
        }
    }

    if(!article.title && !loading) {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 body article__not-found">
                        <span className="article__404">404</span>
                        The article doesn't exist.
                    </div>
                </div>
            </div>
        );
    }

    if(loading) {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 article__loader body">
                        <span className="spinner-border"></span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 article">
                    <div
                    className="article__cover"
                    style={{ background: `url(/img/articles/${article.cover})` }}></div>

                    <div className="article__content-container">
                        <h1 className="article__title">
                            { article.title }
                        </h1>

                        <Content content={article.content}/>

                        { getCategories() }
                    </div>
                </div>
            </div>
        </div>
    );
};