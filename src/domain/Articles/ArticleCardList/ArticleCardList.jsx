import ArticlesFilter from "../../../components/Articles/ArticlesFilter";
import Pagination from "../../../components/Pagination";
import ArticleCard from "../../../components/Articles/ArticleCard";

import ApiController from "../../../services/ApiController";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

import "./ArticleCardList.scss";

export default () => {
    const [articles, setArticles] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const query = useRef();

    const router = useRouter();

    const getFilteredArticles = () => {
        setLoading(true);
        
        query.current = window.location.search;

        ApiController.get(`articles${location.search}`)
        .then(res => {
            if(res.data) {
                setArticles(res.data.articles);
                setPagination(res.data.pagination);
            }

            setLoading(false);
        });
    };

    useEffect(() => {
        getFilteredArticles();
    }, []);

    useEffect(() => {
        if(query.current !== location.search && !loading) {
            getFilteredArticles();
        }
    }, [router.query]);

    const getArticles = () => {
        if(loading) {
            return (
                <div className="col-12 p-0">
                    <div className="article-card-list__loader">
                        <span className="spinner-border"></span>
                    </div>
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
            <div className="col-12 mt-4 d-flex justify-content-center">
                <h4 className="article-card-list__not-found">
                    No Articles Found
                </h4>
            </div>
        );
    }

    const getPagination = () => {
        if(articles.length) {
            return <Pagination pagination={pagination}/>;
        }
    }

    return (
        <div className="article-card-list container-fluid">
            <div className="row mt-4">
                <div className="col-12">

                    <div className="row article-card-list__header">
                        <div className="col-10 col-sm-6 col-lg-8">
                            <h2 className="article-card-list__title">Articles</h2>
                        </div>
                        <div className="col-2 col-sm-6 col-lg-4">
                            <ArticlesFilter/>
                        </div>
                    </div>

                </div>
            </div>
            <div className="row">
                { getArticles() }
            </div>
            <div className="row mt-3">
                <div className="col-12">
                    { getPagination() }
                </div>
            </div>
        </div>
    );
};