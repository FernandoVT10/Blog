import Api from "../../../../ApiController";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import "./Articles.scss";

function Card(props) {
    const mainArticle = props.data[0];

    // This is the items of the most viewed article or main article
    const getViews = () => {
        if(mainArticle) {
            return (
                <span className="statistics-articles__card-views">
                    { mainArticle.views }
                </span>
            );
        }

        return <span className="statistics-articles__card-views--loading"></span>;
    }

    const getCover = () => {
        if(mainArticle) {
            return (
                <img
                src={`/img/articles/${mainArticle.cover}`}
                className="statistics-articles__card-cover"
                alt={ props.title } />
            );
        }

        return <span className="statistics-articles__card-cover--loading"></span>;
    }

    const getTitle = () => {
        if(mainArticle) {
            return (
                <h3 className="statistics-articles__card-title">
                    { mainArticle.title }
                </h3>
            );
        }

        return <span className="statistics-articles__card-title--loading"></span>
    }

    const getArticlesList = () => {
        if(mainArticle) {
            return props.data.map((article, index) => {
                // if the index is 0 it means that it is the main article
                // then we skip it
                if(!index) {
                    return;
                }

                return (
                    <div className="statistics-articles__articles-list-item" key={index}>
                        <img
                        src={`/img/articles/${article.cover}`}
                        className="statistics-articles__articles-list-cover"
                        alt="Article Cover" />

                        <span className="statistics-articles__articles-list-title">
                            { article.title }
                        </span>

                        <span className="statistics-articles__articles-list-views">
                            { article.views }
                        </span>
                    </div>
                );
            });
        }
    }

    const getFooter = () => {
        if(mainArticle) {
            return (
                <span className="statistics-articles__card-footer-text"
                onClick={() => props.showArticlesTable()}>
                    Show All Articles
                </span>
            );
        }

        return (
            <div
            className="spinner-border text-gray"
            role="status">
                <span className="sr-only">Loading...</span>
            </div>
        );
    }

    return (
        <div className="statistics-articles__card">
            <div className="statistics-articles__card-content">
                <span className="statistics-articles__card-label">
                    { props.title }
                </span>

                { getViews() }
                { getCover() }
                { getTitle() }

                <div className="statistics-articles__articles-list">
                    { getArticlesList() }
                </div>
            </div>

            <div className="statistics-articles__card-footer">
                { getFooter() }
            </div>
        </div>
    );
}

export default ({ setShowArticlesTable }) => {
    const [monthViews, setMonthViews] = useState([]);
    const [dayViews, setDayViews] = useState([]);

    const router = useRouter();

    useEffect(() => {
        Promise.all([
            Api.get("views/getMostViewedArticles/month/5", true),
            Api.get("views/getMostViewedArticles/day/5", true)
        ]).then(([monthViews, dayViews]) => {
            setDayViews(dayViews);
            setMonthViews(monthViews);
        });
    }, []);

    const showArticlesTable = (sort) => {
        setShowArticlesTable(true);

        router.push({
            pathname: router.pathname,
            query: { sort }
        });
    };

    return (
        <div className="statistics-articles">
            <Card
            title="Most Viewed Article This Month"
            showArticlesTable={ () => showArticlesTable("month") }
            data={monthViews}/>
            <Card
            title="Most Viewed Article This Day"
            showArticlesTable={ () => showArticlesTable("day") }
            data={dayViews}/>
        </div>
    );
};