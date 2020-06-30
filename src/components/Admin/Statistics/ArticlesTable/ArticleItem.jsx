import { useState } from "react";
import Link from "next/link";

export default ({ article }) => {
    const [activeMenu, setActiveMenu] = useState(false);

    const rowClass = activeMenu ? "custom-table__body-row--active" : "";
    const iconClass = activeMenu ? "fas fa-sort-down" : "fas fa-sort-up";

    return (
        <div className={`custom-table__body-row ${rowClass}`}>
            <div className="statistics-articles-table__article-section">
                <img
                className="custom-table__article__cover"
                src={`/img/articles/${article.cover}`}
                alt="Article Image"/>

                <Link href={`/article/${article._id}`}>
                    <a className="custom-table__article__title">
                        { article.title }
                    </a>
                </Link>
            </div>

            <div className="statistics-articles-table__views-section">
                <span className="statistics-articles-table__hidden-label">
                    Day Views:
                </span>
                <span className="custom-table__article__data">
                    { article.dayViews }
                </span>
            </div>

            <div className="statistics-articles-table__views-section">
                <span className="statistics-articles-table__hidden-label">
                    Month Views:
                </span>
                <span className="custom-table__article__data">
                    { article.monthViews }
                </span>
            </div>

            <div className="statistics-articles-table__views-section">
                <span className="statistics-articles-table__hidden-label">
                    Total Views:
                </span>
                
                <span className="custom-table__article__data">
                    { article.totalViews }
                </span>
            </div>

            <button
            className="statistics-articles-table__toggle-button"
            onClick={() => setActiveMenu(!activeMenu)}>
                <i className={iconClass} aria-hidden="true"></i>
            </button>
        </div>
    );
}