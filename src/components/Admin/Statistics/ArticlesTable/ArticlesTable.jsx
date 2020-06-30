import ArticlesFilter from "../../../Articles/ArticlesFilter";
import Pagination from "../../../Pagination/";
import FullScreenLoader from "../../../FullScreenLoader/";
import ArticleItem from "./ArticleItem";
import Api from "../../../../ApiController";

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
                <div className="custom-table__not-found">
                    <span>Articles Not Found</span>
                </div>
            );
        }

        const sortDayClass = router.query.sort === "day" 
        ? "statistics-articles-table__sort-label--active"
        : "";

        const sortMonthClass = router.query.sort === "month" 
            ? "statistics-articles-table__sort-label--active"
            : "";

        const sortTotalClass = router.query.sort === "total" 
            ? "statistics-articles-table__sort-label--active"
            : "";

        return (
            <div>
                <div className="custom-table__body">
                    <div className="custom-table__body-row">

                        <div className="statistics-articles-table__article-section">
                            <span className="custom-table__body-label ml-2">
                                Article
                            </span>
                        </div>

                        <div className="statistics-articles-table__views-section">
                            <span
                            className={`
                                statistics-articles-table__sort-label
                                ${sortDayClass}
                            `}
                            onClick={() => changeSort("day")}>
                                Day Views
                            </span>
                        </div>

                        <div className="statistics-articles-table__views-section">
                            <span
                            className={`
                                statistics-articles-table__sort-label
                                ${sortMonthClass}
                            `}
                            onClick={() => changeSort("month")}>
                                Month Views
                            </span>
                        </div>

                        <div className="statistics-articles-table__views-section">
                            <span
                            className={`
                                statistics-articles-table__sort-label
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

            <div className="custom-table">
                <div className="custom-table__header">
                    <div className="custom-table__header-title">
                        <button
                        className="statistics-articles-table__back-button"
                        onClick={() => setShowArticlesTable(false)}>
                            <i className="fas fa-arrow-left" aria-hidden="true"></i>
                        </button>

                        Articles Views
                    </div>

                    <div>
                        <ArticlesFilter/>
                    </div>
                </div>

                { getBody() }
            </div>
        </div>
    );
}