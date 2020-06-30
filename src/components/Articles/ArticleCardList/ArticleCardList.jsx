import ArticlesFilter from "../ArticlesFilter";
import Pagination from "../../Pagination";
import ArticleCard from "../ArticleCard/ArticleCard";
import FullScreenLoader from "../../FullScreenLoader";
import Api from "../../../ApiController";

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

        Api.get(`articles/getFilteredArticles${location.search}`)
        .then(data => {
            setArticles(data.articles);
            setPagination(data.pagination);

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
        if(articles.length) {
            return articles.map(article => {
                return (
                    <div className="col-12 col-lg-6 mt-4" key={article._id}>
                        <ArticleCard article={article}/>
                    </div>
                );
            });
        } else {
            return (
                <div className="col-12 mt-4 d-flex justify-content-center">
                    <h4 className="font-weight-bold m-0 color-secondary">
                        No Articles Found
                    </h4>
                </div>
            );
        }
    }

    const getPagination = () => {
        if(articles.length) {
            return <Pagination pagination={pagination}/>;
        }
    } 

    return (
        <div className="articles-container container-fluid">
            <FullScreenLoader loading={loading}/>

            <div className="row mt-4">
                <div className="col-12">

                    <div className="row articles-container__header">
                        <div className="col-10 col-sm-6 col-lg-8">
                            <h2 className="title articles-container__title">Articles</h2>
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