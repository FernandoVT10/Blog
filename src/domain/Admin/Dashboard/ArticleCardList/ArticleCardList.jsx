import ArticleCard from "./ArticleCard";
import ApiController from "../../../../services/ApiController";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import "./ArticleCardList.scss";

export default ({ setShowArticlesTable }) => {
    const [monthViews, setMonthViews] = useState([]);
    const [dayViews, setDayViews] = useState([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        Promise.all([
            ApiController.get("articles?sort=monthViews&paginate=false&limit=5", true),
            ApiController.get("articles?sort=dayViews&paginate=false&limit=5", true)
        ]).then(([monthViews, dayViews]) => {
            if(monthViews.data) {
                const { articles } = monthViews.data;

                // we set the views to show
                setMonthViews(articles.map(article => {
                    article.views = article.monthViews;

                    return article;
                }));
            }
            if(dayViews.data) {
                const { articles } = dayViews.data;

                // we set the views to show
                setDayViews(articles.map(article => {
                    article.views = article.dayViews;

                    return article;
                }));
            }

            setLoading(false);
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
        <div className="dashboard-home-articles">
            <ArticleCard
            title="Most Viewed Article This Month"
            showArticlesTable={ () => showArticlesTable("monthViews") }
            data={monthViews}
            loading={loading}/>
            <ArticleCard
            title="Most Viewed Article This Day"
            showArticlesTable={ () => showArticlesTable("dayViews") }
            data={dayViews}
            loading={loading}/>
        </div>
    );
};