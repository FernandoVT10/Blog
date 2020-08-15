import { useEffect, useState } from "react";

import "./ImagesCarousel.scss";

export default (props) => {
    const [imageActive, setImageActive] = useState(0);
    const [images, setImages] = useState([]);

    useEffect(() => {
        setImageActive(0);
        setImages(props.images.map(
            image => ({
                previewURL: `/img/projects/${image}`,
                isFile: false,
                imageName: image
            })
        ));
    }, []);

    const handleInputFile = ({ target: { files } }) => {
        const file = files[0];

        if(file.type === "image/png"
        || file.type === "image/jpeg"
        || file.type === "image/jpg"
        || file.type === "image/gif") {
            setImageActive(images.length);
            setImages(prevProps => {
                return [...prevProps, {
                    previewURL: URL.createObjectURL(file),
                    isFile: true,
                    imageName: file.name
                }];
            });

            props.setImageFiles(prevProps => [...prevProps, file]);
        }
    }

    const removeImage = (image) => {
        if(imageActive === images.length - 1) {
            setImageActive(imageActive - 1);
        }
        
        if(image.isFile) {
            props.setImageFiles(
                props.imageFiles.filter(imageFile => {
                    if(imageFile.name !== image.imageName) {
                        return imageFile;
                    }
                })
            );
        } else {
            props.setCurrentImages(
                props.currentImages.filter(currenImage => {
                    if(currenImage !== image.imageName) {
                        return currenImage;
                    }
                })
            );
        }

        setImages(images.filter(i => i.imageName !== image.imageName));
    }

    const imageActiveClass = images.length
        ? "project-editor-carousel__image-active--active"
        : "";

    return (
        <div className="project-editor-carousel">
            { images[imageActive] &&
                <img
                className={`project-editor-carousel__image-active ${imageActiveClass}`}
                src={images[imageActive].previewURL}
                alt="Project Image"/>
            }

            <div className="project-editor-carousel__carousel-container">
                {images.map((image, index) => {
                    const imageClass = index === imageActive
                        ? "project-editor-carousel__image--active"
                        : ""

                    return (
                        <div
                        className="project-editor-carousel__carousel-item"
                        key={index}>
                            <div
                            className="project-editor-carousel__image-container"
                            onClick={() => setImageActive(index)}>

                                <img
                                className={`project-editor-carousel__image ${imageClass}`}
                                src={image.previewURL}
                                alt="Carousel Image"/>
                            </div>
                            
                            <button
                            onClick={() => removeImage(image)}
                            className="project-editor-carousel__remove-image">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    );
                })}

                <label
                className="project-editor-carousel__add-image"
                htmlFor="image-carousel-input-file">
                    <i className="fas fa-plus"></i>
                </label>

                <input
                className="project-editor-carousel__input-file"
                onChange={handleInputFile}
                type="file"
                id="image-carousel-input-file"/>
            </div>
        </div>
    );
}