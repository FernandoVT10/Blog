import ApiController from "@/services/ApiController";

import { useEffect, useState } from "react";

import "./MainCarousel.scss";

const MainCarousel = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        ApiController.get("articles?limit=4")
        .then(res => {
            if(res.data) {
                setArticles(res.data.articles);
            }
        });
    }, []);

    return (
        <div id="MainCarousel" className="carousel slide" data-ride="carousel">
            <ol className="carousel-indicators">
                {articles.map((_, index) => {
                    const indicatorClass = index ? "" : "active";

                    return (
                        <li
                        data-target="#MainCarousel"
                        data-slide-to={index}
                        className={indicatorClass}
                        key={index}></li>
                    );
                })}
            </ol>

            <div className="carousel-inner">
                {articles.map((article, index) => {
                    const itemClass = index ? "" : "active";

                    return (
                        <div
                        className={`carousel-item carousel__item ${itemClass}`}
                        key={index}>
                            <img
                            src={`/img/articles/${article.cover}`}
                            className="carousel__image"
                            alt={article.title}
                            loading="lazy" />
                            <div className="carousel-caption d-none d-md-block">
                                <h5 className="font-weight-bold">{article.title}</h5>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <a
            className="carousel-control-prev carousel__control-button"
            href="#MainCarousel"
            role="button"
            data-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="sr-only">Previous</span>
            </a>

            <a
            className="carousel-control-next carousel__control-button"
            href="#MainCarousel" 
            ole="button"
            data-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="sr-only">Next</span>
            </a>
        </div>
    );
}

export default MainCarousel;