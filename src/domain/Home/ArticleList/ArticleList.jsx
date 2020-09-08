import ApiController from "@/services/ApiController";
import ArticleCard from "@/components/Articles/ArticleCard/";

import { useEffect, useState } from "react";

import "./ArticleList.scss";

const ArticleList = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        ApiController.get("articles?page=2&limit=4")
        .then(res => {
            if(res.data) {
                setArticles(res.data.articles);
            }

            setLoading(false);
        });
    }, []);

    const getArticles = () => {
        if(loading) {
            return (
                <div className="col-12 home-article-list__loader">
                    <span className="spinner-border home-article-list__spinner"></span>
                </div>
            );
        }

        if(articles.length) {
            return articles.map(article => {
                return (
                    <div className="col-12 col-lg-6 mt-4" key={article._id}>
                        <ArticleCard article={article}/>
                    </div>
                );
            });
        }

        return (
            <div className="col-12 mt-4">
                <h4 className="home-article-list__not-found">
                    There is not available articles
                </h4>
            </div>
        );
    }

    return (
        <div className="container-fluid home-article-list">
            <div className="row">
                <div className="col-12">
                    <h2 className="home-article-list__title mt-4">Recent Articles</h2>
                </div>
            </div>

            <div className="row">
                { getArticles() }
            </div>
        </div>
    );
}

export default ArticleList;