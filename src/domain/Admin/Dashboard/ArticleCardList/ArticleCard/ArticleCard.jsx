import ArticleItem from "./ArticleItem";

import separateThousands from "../../../../../services/separateThousands";

import "./ArticleCard.scss";

export default (props) => {
    // This is the most viewed article or main article
    const getMainArticle = () => {
        const mainArticle = props.data[0];

        if(!mainArticle) {
            return (
                <div>
                    <span className="dashboard-home-article-card__views--loading"></span>
                    <span className="dashboard-home-article-card__cover--loading"></span>
                    <span className="dashboard-home-article-card__title--loading"></span>
                </div>
            );
        }

        return (
            <div>
                <span className="dashboard-home-article-card__views">
                    { separateThousands(mainArticle.views) }
                </span>

                <img
                src={`/img/articles/${mainArticle.cover}`}
                className="dashboard-home-article-card__cover"
                alt={ props.title } />

                <h3 className="dashboard-home-article-card__title">
                    { mainArticle.title }
                </h3>
            </div>
        );
    }

    const getFooter = () => {
        if(!props.loading) {
            return (
                <span className="dashboard-home-article-card__footer-text"
                onClick={() => props.showArticlesTable()}>
                    Show All Articles
                </span>
            );
        }

        return (
            <div
            className="dashboard-home-article-card__loader"
            role="status">
                <span className="spinner-border"></span>
            </div>
        );
    }

    return (
        <div className="dashboard-home-article-card">
            <div className="dashboard-home-article-card__content">
                <span className="dashboard-home-article-card__label">
                    { props.title }
                </span>

                { getMainArticle() }

                <div className="dashboard-home-articles__articles-list">
                    {props.data.map((article, index) => {
                        // if the index is 0 it means that it's the main article
                        // then we skip it
                        if(!index) {
                            return;
                        }

                        return <ArticleItem article={article} key={index}/>;
                    })}
                </div>
            </div>

            <div className="dashboard-home-article-card__footer">
                { getFooter() }
            </div>
        </div>
    );
}