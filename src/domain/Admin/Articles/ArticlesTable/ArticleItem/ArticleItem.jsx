import ConfirmModal from "../../../../../components/ConfirmModal";

import { useState } from "react";

import Link from "next/link";

export default ({ article, deleteArticle }) => {
    const [confirmModalActive, setConfirmModalActive] = useState(false);

    const onClose = (confirm) => {
        if(confirm) {
            deleteArticle(article._id);
        }

        setConfirmModalActive(false);
    }

    return (
        <div className="custom-table__body-row">
            <ConfirmModal
            active={confirmModalActive}
            message={`Are you sure to delete ${article.title}?`}
            prefix={article._id}
            onClose={onClose} />

            <div className="admin-articles-table__image-section">
                <img
                className="custom-table__article__cover"
                src={`/img/articles/${article.cover}`}
                alt="Article Image"/>
            </div>

            <div className="admin-articles-table__title-section">
                <Link href={`/article/${article._id}`}>
                    <a className="custom-table__article__title">
                        { article.title }
                    </a>
                </Link>
            </div>

            <div className="admin-articles-table__actions-section">
                <Link href={`?editArticleId=${article._id}`}>
                    <button
                    className="custom-table__button custom-table__button--edit">
                        <i className="fas fa-edit" aria-hidden="true"></i>
                    </button>
                </Link>

                <button
                className="custom-table__button custom-table__button--delete"
                onClick={() => setConfirmModalActive(true)}>
                    <i className="fas fa-times" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    );
}