import "./ArticlesFilter.scss";

export default () => {
    return (
        <div className="articles-filter">
            <form>
                <div className="articles-filter__search-container">
                    <input
                    className="articles-filter__search-input"
                    type="search"
                    placeholder="Search article"
                    autoComplete="search" />

                    <button type="submit" className="articles-filter__search-button">
                        <i className="fas fa-search" aria-hidden="true"></i>
                    </button>
                </div>
                
                <a href="#" className="articles-filter__filter-button">
                    <i className="fas fa-sort-amount-down-alt" aria-hidden="true"></i>
                </a>
            </form>
        </div>
    );
};