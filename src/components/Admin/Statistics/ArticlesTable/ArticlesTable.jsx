import ArticlesFilter from "../../../ArticlesFilter";
import Pagination from "../../../Pagination/";
import FullScreenLoader from "../../../FullScreenLoader/";
import Api from "../../../../ApiController";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import "./ArticlesTable.scss";

function ArticleItem({ article }) {
    const [activeMenu, setActiveMenu] = useState(false);

    const rowClass = activeMenu ? "statistics-articles-table__row--active" : "";
    const iconClass = activeMenu ? "fas fa-sort-down" : "fas fa-sort-up";

    return (
        <div className={`statistics-articles-table__row ${rowClass}`}>
            <div className="statistics-articles-table__row-article">
                <img
                className="statistics-articles-table__row-cover"
                src={`/img/articles/${article.cover}`}
                alt="Article Image"/>

                <span className="statistics-articles-table__row-title">
                    { article.title }
                </span>
            </div>

            <div className="statistics-articles-table__row-views-data">
                <span className="statistics-articles-table__row-hidden-label">
                    Day Views:
                </span>
                <span className="statistics-articles-table__row-views">
                    { article.dayViews }
                </span>
            </div>

            <div className="statistics-articles-table__row-views-data">
                <span className="statistics-articles-table__row-hidden-label">
                    Month Views:
                </span>
                <span className="statistics-articles-table__row-views">
                    { article.monthViews }
                </span>
            </div>

            <div className="statistics-articles-table__row-views-data">
                <span className="statistics-articles-table__row-hidden-label">
                    Total Views:
                </span>
                
                <span className="statistics-articles-table__row-views">
                    { article.totalViews }
                </span>
            </div>

            <button
            className="statistics-articles-table__row-toggle-button"
            onClick={() => setActiveMenu(!activeMenu)}>
                <i className={iconClass} aria-hidden="true"></i>
            </button>
        </div>
    );
}

export default ({ setShowArticlesTable }) => {
    const [articles, setArticles] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setLoading(true);

        Api.get("views/getArticles" + window.location.search, true)
        .then(data => {
            if(data.articles) {
                setArticles(data.articles);
            }

            if(data.pagination) {
                setPagination(data.pagination);
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

    const getBody = () => {
        if(!articles.length) {
            return (
                <div className="statistics-articles-table__articles-not-found">
                    <span>Articles Not Found</span>
                </div>
            );
        }

        const sortDayClass = router.query.sort === "day" 
        ? "statistics-articles-table__row-sort-label--active"
        : "";

        const sortMonthClass = router.query.sort === "month" 
            ? "statistics-articles-table__row-sort-label--active"
            : "";

        const sortTotalClass = router.query.sort === "total" 
            ? "statistics-articles-table__row-sort-label--active"
            : "";

        return (
            <div>
                <div className="statistics-articles-table__body">
                    <div className="statistics-articles-table__row">

                        <div className="statistics-articles-table__row-article">
                            <span className="statistics-articles-table__row-label ml-2">
                                Article
                            </span>
                        </div>

                        <div className="statistics-articles-table__row-views-data">
                            <span
                            className={`
                                statistics-articles-table__row-sort-label
                                ${sortDayClass}
                            `}
                            onClick={() => changeSort("day")}>
                                Day Views
                            </span>
                        </div>

                        <div className="statistics-articles-table__row-views-data">
                            <span
                            className={`
                                statistics-articles-table__row-sort-label
                                ${sortMonthClass}
                            `}
                            onClick={() => changeSort("month")}>
                                Month Views
                            </span>
                        </div>

                        <div className="statistics-articles-table__row-views-data">
                            <span
                            className={`
                                statistics-articles-table__row-sort-label
                                ${sortTotalClass}
                            `}
                            onClick={() => changeSort("total")}>
                                Total Views
                            </span>
                        </div>
                    </div>

                    { articles.map((article, index) => {
                        return <ArticleItem article={article} key={index} />;
                    }) }
                </div>

                <div className="statistics-articles-table__footer">
                    <Pagination pagination={pagination}/>
                </div>
            </div>
        );
    };

    return (
        <div className="statistics-articles-table">
            <FullScreenLoader loading={loading} />

            <div className="statistics-articles-table__header">
                <div className="statistics-articles-table__header-title">
                    <button
                    className="statistics-articles-table__header-back-button"
                    onClick={() => setShowArticlesTable(false)}>
                        <i className="fas fa-arrow-left" aria-hidden="true"></i>
                    </button>

                    Articles Views
                </div>

                <div className="statistics-articles-table__header-filter-container">
                    <ArticlesFilter/>
                </div>
            </div>

            { getBody() }
        </div>
    );
}