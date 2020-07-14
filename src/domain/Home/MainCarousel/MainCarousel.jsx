import "./MainCarousel.scss";

export default () => {
    return (
        <div id="MainCarousel" className="carousel slide" data-ride="carousel">
            <ol className="carousel-indicators">
                <li data-target="#MainCarousel" data-slide-to="0" className="active"></li>
                <li data-target="#MainCarousel" data-slide-to="1"></li>
            </ol>

            <div className="carousel-inner">
                <div className="carousel-item carousel__item active">
                    <img
                    src="/img/carousel/carousel-1.jpg"
                    className="carousel__image"
                    alt="Carousel image" />
                </div>
                <div className="carousel-item">
                    <img
                    src="/img/carousel/carousel-2.jpg"
                    className="carousel__image"
                    alt="Carousel image" />
                </div>
            </div>
            
            <a
            className="carousel-control-prev carousel__control-button"
            href="#MainCarousel"
            role="button"
            data-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="sr-only">Previous</span>
            </a>

            <a
            className="carousel-control-next carousel__control-button"
            href="#MainCarousel" 
            ole="button"
            data-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="sr-only">Next</span>
            </a>
        </div>
    );
};