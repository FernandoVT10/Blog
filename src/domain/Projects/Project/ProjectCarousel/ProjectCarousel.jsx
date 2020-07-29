import ImagePreview from "./ImagePreview";

import { useState } from "react";

import "./ProjectCarousel.scss";

export default ({ title, images }) => {
    const [imagePreview, setImagePreview] = useState("");

    return (
        <div>
            <ImagePreview image={imagePreview} setImage={setImagePreview} />

            <div
            id="projectCarousel"
            className="carousel project-carousel slide"
            data-ride="carousel">
                <ol className="carousel-indicators">
                    {images.map((_, index) => {
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
                    {images.map((image, index) => {
                        const carouselItemClass = index ? "" : "active";

                        return (
                            <div
                            className={`carousel-item ${carouselItemClass}`}
                            key={index}>
                                <img
                                className="d-block w-100 project-carousel__image"
                                onClick={() => setImagePreview(image)}
                                src={`/img/projects/${image}`}
                                alt={title} />
                            </div>
                        );
                    })}
                    
                </div>
                <a
                className="carousel-control-prev project-carousel__control-button"
                href="#projectCarousel"
                role="button"
                data-slide="prev">
                    <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a
                className="carousel-control-next project-carousel__control-button"
                href="#projectCarousel"
                role="button"
                data-slide="next">
                    <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                </a>
            </div>
        </div>
    );
};