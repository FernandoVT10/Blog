export default ({ project }) => {
    return (
        <div
        id="projectCarousel"
        className="carousel project-details__carousel slide"
        data-ride="carousel">
            <ol className="carousel-indicators">
                {project.images.map((_, index) => {
                    const indicatorClass = index ? "" : "active";

                    return (
                        <li
                        key={index}
                        data-target="#projectCarousel"
                        data-slide-to={index}
                        className={indicatorClass}></li>
                    );
                })}
            </ol>
            <div className="carousel-inner">
                {project.images.map((image, index) => {
                    const carouselItemClass = index ? "" : "active";

                    return (
                        <div
                        className={`carousel-item ${carouselItemClass}`}
                        key={index}>
                            <img
                            className="d-block w-100 project-details__carousel-image"
                            src={`/img/projects/${image}`}
                            alt={project.title} />
                        </div>
                    );
                })}
                
            </div>
            <a
            className="carousel-control-prev project-details__control-button"
            href="#projectCarousel"
            role="button"
            data-slide="prev">
                <span
                className="carousel-control-prev-icon"
                aria-hidden="true"></span>
                <span className="sr-only">Previous</span>
            </a>
            <a
            className="carousel-control-next  project-details__control-button"
            href="#projectCarousel"
            role="button"
            data-slide="next">
                <span
                className="carousel-control-next-icon"
                aria-hidden="true"></span>
                <span className="sr-only">Next</span>
            </a>
        </div>
    );
};