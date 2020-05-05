import Layout from "../components/Layout/";
import Navbar from "../components/Navbar/";
import Footer from "../components/Footer/";
import ArticlesFilter from "../components/ArticlesFilter/";
import ArticleCard from "../components/ArticleCard/";
import Pagination from "../components/Pagination/";
import FullScreenLoader from "../components/FullScreenLoader";
import Api from "../ApiController";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import "../styles/pages/articles.scss";
export default () => {
    const [articles, setArticles] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        setLoading(true)
        Api.get(`articles/getFilteredArticles${location.search}`)
        .then(data => {
            setArticles(data.articles);
            setPagination(data.pagination);

            setLoading(false);
        });
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
        <Layout title="Articles - Fernando Blog">
            <FullScreenLoader loading={loading}/>
            <Navbar/>

            <div className="body">
                <div className="articles-container container-fluid">
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
            </div>

            <Footer/>
        </Layout>
    );
};