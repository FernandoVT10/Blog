const ImagePreview =  ({ image, setImage }) => {
    const imagePreviewClass = image ? "projects-project-carousel__image-preview--active" : "";

    if(!image) {
        return null;
    }

    return (
        <div className={`projects-project-carousel__image-preview ${imagePreviewClass}`}>
            <img
            className="projects-project-carousel__image-preview__image"
            src={`/img/projects/${image}`}
            alt="Image Preview"/>

            <button
            onClick={() => setImage("")}
            className="projects-project-carousel__image-preview__close-button">
                <span className="fa fa-times" aria-hidden="true"></span>
            </button>
        </div>
    );
}

export default ImagePreview;