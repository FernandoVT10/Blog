import "./Loader.scss";

export default ({ active,  height = 300 }) => {
    const loaderClass = active ? "loader--active" : "";
    
    return (
        <div
        className={`loader ${loaderClass}`}
        style={{ height }}>
            <div
            className="spinner-border text-light loader__spinner"
            role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
};