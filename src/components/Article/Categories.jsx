import Api from "../../ApiController";

import Link from "next/link";
import { useState, useEffect } from "react";

export default ({ editArticle, categories, onChangeCategories }) => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [addCategoryStatus, setAddCategoryStatus] = useState(false);

    useEffect(() => {
        Api.get("categories/getAllCategories")
        .then(data => {
            if(data.length) {
                setAllCategories(data.map(category => {
                    let active = false;

                    categories.forEach(({ name }) => {
                        if(name === category.name) {
                            active = true;
                        }
                    });

                    return {
                        _id: category._id,
                        name: category.name,
                        active
                    };
                }));
            }
        });
    }, []);

    useEffect(() => setSelectedCategories(categories.map(
        category => category.name
    )), [categories]);

    const handleCheckbox = (categoryName) => {
        if(selectedCategories.includes(categoryName)) {
            const newCategories = selectedCategories.filter(
                localCategory => localCategory !== categoryName
            );

            setSelectedCategories(newCategories);
            onChangeCategories(newCategories);
        } else {
            const newCategories = [...selectedCategories, categoryName];

            onChangeCategories(newCategories);
            setSelectedCategories(newCategories);
        }

        setAllCategories(allCategories.map(allCategory => {
            if(allCategory.name === categoryName) {
                return (
                    {
                        _id: allCategory._id,
                        name: allCategory.name,
                        active: !allCategory.active
                    }
                );
            }
            
            return allCategory;
        }));
    };

    const getCategories = () => {
        return allCategories.map(category => {
            return (
                <div key={category._id} className="formulary__checkbox">
                    <input
                    className="formulary__checkbox__input"
                    id={`category-${category.name}`}
                    onChange={() => handleCheckbox(category.name)}
                    type="checkbox"
                    checked={category.active} />

                    <label
                    className="formulary__checkbox__label"
                    htmlFor={`category-${category.name}`}>
                        <span className="formulary__checkbox__label-checkbox"></span>
                        { category.name }
                    </label>
                </div>
            );
        });
    };

    if(editArticle) {
        const addCategoryClass = addCategoryStatus
        ? "article__categories__add-category--active"
        : "";

        return (
            <div className="article__categories">
                <i className="fas fa-tags" aria-hidden="true"></i>

                <div
                className="article__categories__button-container">
                    <button
                    className="article__categories__add-button"
                    onClick={() => setAddCategoryStatus(!addCategoryStatus)}>
                        <i className="fas fa-plus" aria-hidden="true"></i>
                    </button>

                    <div className={`article__categories__add-category ${addCategoryClass}`}>
                        { getCategories() }
                    </div>
                </div>

                <div className="article__categories__container">
                    {selectedCategories.map((categoryName, index) => {
                        return (
                            <Link
                            href={`/articles?categories=${categoryName}`}
                            key={index}>
                                <a className="article__category mr-2">
                                    { categoryName }
                                </a>
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    }

    if(categories.length) {
        return (
            <div className="article__categories">
                <i className="fas fa-tags" aria-hidden="true"></i>

                <span className="ml-2">
                    {categories.map((category, index) => {
                        return (
                            <Link
                            href={`/articles?categories=${category.name}`}
                            key={index}>
                                <a className="article__category mr-2">
                                    { category.name }
                                </a>
                            </Link>
                        );
                    })}
                </span>
            </div>
        );
    }

    return null;
};