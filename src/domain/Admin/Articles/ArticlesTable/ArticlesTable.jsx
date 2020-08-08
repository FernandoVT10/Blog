import ArticleItem from "./ArticleItem";

import ArticlesFilter from "../../../../components/Articles/ArticlesFilter";
import Pagination from "../../../../components/Pagination";

import ApiController from "../../../../services/ApiController";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import "./ArticlesTable.scss";
import { useRef } from "react";

export default ({ setAddArticle }) => {
    const [articles, setArticles] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const query = useRef();

    const router = useRouter();

    useEffect(() => {
        if(query.current !== window.location.search) {
            setLoading(true);
            query.current = window.location.search;

            ApiController.get("articles" + window.location.search)
            .then(res => {
                if(res.data) {
                    setArticles(res.data.articles);
                    setPagination(res.data.pagination);
                }

                setLoading(false);
            });
        }
    }, [router.query]);

    const deleteArticle = (articleId) => {
        ApiController.delete(`articles/${ articleId }`)
        .then(res => {
            if(!res.errors) {
                const query = router.query;

                // we check if there is only one article
                if(articles.length === 1) {
                    // then we check if the offset is more than 0
                    if(query.page) {
                        // then we substract one becuase when we load the others articles
                        // none will be loaded in this "offset"
                        query.page -= 1;
                    }
                }

                router.push({
                    pathname: router.pathname,
                    query
                });
            }
        });
    }

    const getTableBody = () => {
        if(loading) {
            return (
                <div className="admin-articles-table">
                    <div className="admin-articles-table__loader">
                        <span className="spinner-border"></span>
                    </div>
                </div>
            );
        }

        if(!articles.length) {
            return (
                <div className="custom-table__not-found">
                    <span>Articles Not Found</span>
                </div>
            );
        }

        return (
            <div className="admin-articles-table">
                <div className="custom-table">
                    <div className="custom-table__body">
                        <div className="custom-table__body-row">
                            <div className="admin-articles-table__image-section">
                                <span className="custom-table__body-label ml-2">
                                    Image
                                </span>
                            </div>

                            <div className="admin-articles-table__title-section">
                                <span className="custom-table__body-label ml-3">
                                    Title
                                </span>
                            </div>

                            <div className="admin-articles-table__actions-section">
                                <span className="custom-table__body-label">
                                    Actions
                                </span>
                            </div>
                        </div>

                        { articles.map((article, index) => {
                            return (
                                <ArticleItem
                                deleteArticle={deleteArticle}
                                article={article}
                                key={index} />
                            );
                        }) }
                    </div>

                    <div className="custom-table__footer">
                        <Pagination pagination={pagination}/> 
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="custom-table">
            <div className="custom-table__header">
                <div className="custom-table__header-title">
                    <button
                    className="admin-articles-table__add-article-button"
                    onClick={() => setAddArticle(true)}>
                        <i className="fas fa-plus"></i>
                    </button>

                    Articles List
                </div>

                <div className="custom-table__header-filter-container">
                    <ArticlesFilter/>
                </div>
            </div>

            { getTableBody() }
        </div>
    );
}