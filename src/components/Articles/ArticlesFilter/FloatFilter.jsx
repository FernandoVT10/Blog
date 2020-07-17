export default ({ search, setSearch, setCategories, categories, filterActive }) => {
    const handleCategory = name => {
        setCategories(categories.map(category => {
            if(category.name === name) {
                Object.assign(category, { active: !category.active });
            }

            return category;
        }));
    };

    const getCategories = () => {
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
    };

    const filterClass = filterActive ? "articles-filter__filter--active" : "";

    return (
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
                className="articles-filter__set-categories-button">
                    Set Categories
                </button>
            </div>
        </div>
    );
}