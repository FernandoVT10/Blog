import separateThousands from "../../../../../../services/separateThousands";

import "./ArticleItem.scss";

export default ({ article }) => {
    return (
        <div className="dashboard-home-article-card-item">
            <img
            src={`/img/articles/${article.cover}`}
            className="dashboard-home-article-card-item__cover"
            alt="Article Cover" />

            <span className="dashboard-home-article-card-item__title">
                { article.title }
            </span>

            <span className="dashboard-home-article-card-item__views">
                { separateThousands(article.views) }
            </span>
        </div>
    );
}