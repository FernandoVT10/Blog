import CategoryList from "./CategoryList";

import { useState } from "react";
import Link from "next/link";

import "./Categories.scss";

export default ({ categories, onChangeCategories }) => {
    const [isActive, setIsActive] = useState(false);

    const addCategoryClass = isActive
    ? "article-editor-categories__add-category--active"
    : "";

    return (
        <div className="article-editor-categories">
            <i className="fas fa-tags" aria-hidden="true"></i>

            <div
            className="article-editor-categories__button-container">
                <button
                className="article-editor-categories__add-button"
                onClick={() => setIsActive(!isActive)}>
                    <i className="fas fa-plus" aria-hidden="true"></i>
                </button>

                <div className={`article-editor-categories__add-category ${addCategoryClass}`}>
                    <CategoryList
                    categories={categories}
                    onChangeCategories={onChangeCategories}/>
                </div>
            </div>

            <div className="article-editor-categories__container">
                {categories.map((categoryName, index) => {
                    return (
                        <Link
                        href={`/articles?categories=${categoryName}`}
                        key={index}>
                            <a className="article-editor-categories__category mr-2">
                                { categoryName }
                            </a>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};