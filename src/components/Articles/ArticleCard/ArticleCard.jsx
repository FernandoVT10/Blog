import Link from "next/link";

import "./ArticleCard.scss";

const ArticleCard = ({ article }) => {
    return (
        <div className="article-card">
            <img
            src={`/img/articles/${article.cover}`}
            className="article-card__cover"
            alt={article.title}
            loading="lazy" />

            <div className="article-card__details">
                <h3 className="article-card__title">{ article.title }</h3>

                <p className="article-card__description">{ article.description }</p>

                <Link href="/article/[id]" as={`/article/${article._id}`}>
                    <a className="article-card__link">
                        Continue Reading

                        <i className="fas fa-arrow-right ml-1" aria-hidden="true"></i>
                    </a>
                </Link>
            </div>
        </div>
    );
}

export default ArticleCard;