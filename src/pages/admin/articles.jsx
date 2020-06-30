import AdminLayout from "../../components/Admin/AdminLayout/";
import ArticlesFilter from "../../components/Articles/ArticlesFilter/";
import Pagination from "../../components/Pagination/";
import FullScreenLoader from "../../components/FullScreenLoader/";
import ConfirmModal from "../../components/ConfirmModal/";
import Api from "../../ApiController";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import "../../styles/pages/admin/articles.scss";

function ArticleItem({ article, deleteArticle }) {
    const [confirmModalActive, setConfirmModalActive] = useState(false);

    const onClose = useCallback((confirm) => {
        if(confirm) {
            deleteArticle(article._id);
        }

        setConfirmModalActive(false);
    });

    return (
        <div className="custom-table__body-row">
            <ConfirmModal
            active={confirmModalActive}
            message={`Are you sure to delete ${article.title}?`}
            prefix={article._id}
            onClose={onClose} />

            <div className="admin-articles-table__image-section">
                <img
                className="custom-table__article__cover"
                src={`/img/articles/${article.cover}`}
                alt="Article Image"/>
            </div>

            <div className="admin-articles-table__title-section">
                <Link href={`/article/${article._id}`}>
                    <a className="custom-table__article__title">
                        { article.title }
                    </a>
                </Link>
            </div>

            <div className="admin-articles-table__actions-section">
                <Link href={`/article/${article._id}?editArticle=true`}>
                    <button className="custom-table__button custom-table__button--edit">
                        <i className="fas fa-edit" aria-hidden="true"></i>
                    </button>
                </Link>
                <button
                className="custom-table__button custom-table__button--delete"
                onClick={() => setConfirmModalActive(true)}>
                    <i className="fas fa-times" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    );
}

export default () => {
    const [articles, setArticles] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setLoading(true);

        Api.get("articles/getFilteredArticles" + window.location.search, true)
        .then(data => {
            if(data.articles) {
                setArticles(data.articles);
            }

            if(data.pagination) {
                setPagination(data.pagination);
            }

            setLoading(false);
        });
    }, [router]);

    const deleteArticle = useCallback((articleId) => {
        Api.delete("articles/deleteArticle/", { articleId })
        .then(data => {
            if(data.status) {
                const query = router.query;

                // we check if there is only one article
                if(articles.length === 1) {
                    // then we check if the offset is more than 1
                    if(query.offset) {
                        // then we substract one becuase when we load the others articles
                        // none will be loaded in this "offset"
                        query.offset -= 1;
                    }
                }

                router.push({
                    pathname: router.pathname,
                    query
                });
            }
        });
    });

    const getBody = () => {
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
        <AdminLayout>
            <div className="custom-table">
                <FullScreenLoader loading={loading} />

                <div className="custom-table__header">
                    <div className="custom-table__header-title">
                        Articles List
                    </div>

                    <div className="custom-table__header-filter-container">
                        <ArticlesFilter/>
                    </div>
                </div>

                { getBody() }
            </div>
        </AdminLayout>
    );
}