import ArticleCard from "./ArticleCard";
import Api from "../../../../ApiController";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import "./Articles.scss";

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
            <ArticleCard
            title="Most Viewed Article This Month"
            showArticlesTable={ () => showArticlesTable("month") }
            data={monthViews}/>
            <ArticleCard
            title="Most Viewed Article This Day"
            showArticlesTable={ () => showArticlesTable("day") }
            data={dayViews}/>
        </div>
    );
};