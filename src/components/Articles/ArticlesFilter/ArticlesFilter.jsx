import FloatFilter from "./FloatFilter";

import ApiController from "../../../services/ApiController";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import "./ArticlesFilter.scss";

function ArticlesFilter() {
    const [filterActive, setFilterActive] = useState(false);
    const [search, setSearch] = useState("");
    const [categories, setCategories] = useState([]);

    const router = useRouter();

    useEffect(() => {
        // we use the URLSearchParams with window.location.search, 
        // because the router.query is undefined in the first call
        const queryCategories = new URLSearchParams(location.search).getAll("categories");

        ApiController.get("categories")
        .then(res => {
            if(res.data) {
                const categories = res.data.categories.map(({ _id, name }) => {
                    if(queryCategories.includes(name)) {
                        return { active: true, _id, name };
                    } else {
                        return { active: false, _id, name };
                    }
                });

                setCategories(categories);
            }
        });
    }, []);

    useEffect(() => {
        if(router.query.search) {
            setSearch(router.query.search);
        }
    }, [router.query]);

    const handleForm = e => {
        e.preventDefault();
        setFilterActive(false);

        const activeCategories = [];
        const query = {};

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

                <FloatFilter
                search={search}
                setSearch={setSearch}
                categories={categories}
                setCategories={setCategories}
                filterActive={filterActive}/>
                
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