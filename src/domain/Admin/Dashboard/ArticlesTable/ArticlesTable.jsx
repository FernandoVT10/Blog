import ArticlesFilter from "../../../../components/Articles/ArticlesFilter";
import Pagination from "../../../../components/Pagination";

import ArticleItem from "./ArticleItem";

import ApiController from "../../../../services/ApiController";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import "./ArticlesTable.scss";

export default ({ setShowArticlesTable }) => {
    const [articles, setArticles] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setLoading(true);

        ApiController.get("articles" + window.location.search, true)
        .then(res => {
            if(res.data) {
                setArticles(res.data.articles);
                setPagination(res.data.pagination);
            }

            setLoading(false);
        });
    }, [window.location.search]);

    const changeSort = (sort) => {
        const query = router.query;
        
        query.sort = sort;

        router.push({
            pathname: router.pathname,
            query: query
        });
    };

    const getArticles = () => {
        if(!articles.length) {
            return (
                <div className="custom-table__not-found">
                    <span>Articles Not Found</span>
                </div>
            );
        }

        const sortDayClass = router.query.sort === "dayViews" 
        ? "dashboard-articles-table__sort-label--active"
        : "";

        const sortMonthClass = router.query.sort === "monthViews" 
            ? "dashboard-articles-table__sort-label--active"
            : "";

        const sortTotalClass = router.query.sort === "totalViews" 
            ? "dashboard-articles-table__sort-label--active"
            : "";

        return (
            <div>
                <div className="custom-table__body">
                    <div className="custom-table__body-row">

                        <div className="dashboard-articles-table__article-section">
                            <span className="custom-table__body-label ml-2">
                                Article
                            </span>
                        </div>

                        <div className="dashboard-articles-table__views-section">
                            <span
                            className={`
                                dashboard-articles-table__sort-label
                                ${sortDayClass}
                            `}
                            onClick={() => changeSort("dayViews")}>
                                Day Views
                            </span>
                        </div>

                        <div className="dashboard-articles-table__views-section">
                            <span
                            className={`
                                dashboard-articles-table__sort-label
                                ${sortMonthClass}
                            `}
                            onClick={() => changeSort("monthViews")}>
                                Month Views
                            </span>
                        </div>

                        <div className="dashboard-articles-table__views-section">
                            <span
                            className={`
                                dashboard-articles-table__sort-label
                                ${sortTotalClass}
                            `}
                            onClick={() => changeSort("totalViews")}>
                                Total Views
                            </span>
                        </div>
                    </div>

                    { articles.map((article, index) => {
                        return <ArticleItem article={article} key={index} />;
                    }) }
                </div>

                <div className="dashboard-articles-table__footer">
                    <Pagination pagination={pagination}/>
                </div>
            </div>
        );
    };

    return (
        <div className="dashboard-articles-table">
            <div className="custom-table">
                <div className="custom-table__header">
                    <div className="custom-table__header-title">
                        <button
                        className="dashboard-articles-table__back-button"
                        onClick={() => setShowArticlesTable(false)}>
                            <i className="fas fa-arrow-left" aria-hidden="true"></i>
                        </button>

                        Articles Views
                    </div>

                    <div>
                        <ArticlesFilter/>
                    </div>
                </div>

                { getArticles() }
            </div>
        </div>
    );
}