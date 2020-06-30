import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Api from "../../../ApiController";

import "./ArticlesFilter.scss";

function ArticlesFilter() {
    const [filterActive, setFilterActive] = useState(false);
    const [search, setSearch] = useState("");
    const [categories, setCategories] = useState([]);

    const router = useRouter();

    // we active the categories with the URL query
    const setCategoriesStatus = (categories, queryCategories) => {
        setCategories(categories.map(({ _id, name }) => {
            if(queryCategories.includes(name)) {
                return { active: true, _id, name };
            } else {
                return { active: false, _id, name };
            }
        }));
    }

    useEffect(() => {
        // we use the URLSearchParams with window.location.search, 
        // because the router.query is undefined in the first call
        const queryCategories = new URLSearchParams(location.search).getAll("categories");

        Api.get("categories/getAllCategories/")
        .then(categories => setCategoriesStatus(categories, queryCategories));
    }, []);

    useEffect(() => {
        if(router.query.search) {
            setSearch(router.query.search);
        }
    }, [router]);

    const handleForm = e => {
        e.preventDefault();
        setFilterActive(false);

        const activeCategories = [];
        const query = router.query;

        delete query.search;
        delete query.categories;

        categories.forEach(({ active, name }) => {
            if(active) {
                activeCategories.push(name);
            }
        });

        if(search) {
            query.search = search;
        }

        if(activeCategories.length) {
            query.categories = activeCategories;
        }

        router.push({
            pathname: router.pathname,
            query: query
        });
    };

    // Active or desactive the category
    const handleCategory = name => {
        setCategories(categories.map(category => {
            if(category.name === name) {
                Object.assign(category, { active: !category.active });
            }

            return category;
        }));
    };

    const getCategories = () => {
        if(categories.length) {
            return categories.map(category => {
                return (
                    <div key={category._id} className="formulary__checkbox">
                        <input
                        className="formulary__checkbox__input"
                        id={`category-${category.name}`}
                        onChange={() => handleCategory(category.name)}
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
        }
    };

    const filterClass = filterActive ? "articles-filter__filter--active" : "";
    const filterButtonClass = filterActive ? "articles-filter__filter-button--active" : "";
    
    return (
        <div className="articles-filter">
            <form onSubmit={handleForm}>
                <div className="articles-filter__search-container">
                    <input
                    className="formulary__input"
                    type="search"
                    placeholder="Search article"
                    value={search}
                    onChange={({ target: { value } }) => setSearch(value)}
                    autoComplete="search" />

                    <button type="submit" className="articles-filter__search-button">
                        <i className="fas fa-search" aria-hidden="true"></i>
                    </button>
                </div>

                <div className={`articles-filter__filter ${filterClass}`}>
                    <input
                    className="formulary__input articles-filter__filter-search"
                    type="search"
                    placeholder="Search article"
                    value={search}
                    onChange={({ target: { value } }) => setSearch(value)}
                    autoComplete="search" />

                    <div className="articles-filter__categories-container">
                        <h4 className="articles-filter__categories-title">Categories</h4>

                        <div className="aticles-filter__categories">
                            { getCategories() }
                        </div>

                        <button
                        type="submit"
                        className="submit-button articles-filter__set-categories-button">
                            Set Categories
                        </button>
                    </div>
                </div>
                
                <a
                onClick={() => setFilterActive(!filterActive)}
                href="#"
                className={`articles-filter__filter-button ${filterButtonClass}`}>
                    <i className="fas fa-sort-amount-down-alt" aria-hidden="true"></i>
                </a>
            </form>
        </div>
    );
};

export default ArticlesFilter;