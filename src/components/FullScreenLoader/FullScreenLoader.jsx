import "./FullScreenLoader.scss";

export default ({ loading, text = "Loading..." }) => {
    const fullScreenLoaderClass = loading ? "full-screen-loader--active" : "";
    
    return (
        <div className={`full-screen-loader ${fullScreenLoaderClass}`}>
            <div
            className="full-screen-loader__spinner spinner-border text-light"
            role="status">
                <span className="sr-only">Loading...</span>
            </div>

            <h3 className="full-screen-loader__text">{ text }</h3>
        </div>
    );
};