export default ({ image, setImage }) => {
    const imagePreviewClass = image ? "project-carousel__image-preview--active" : "";

    return (
        <div className={`project-carousel__image-preview ${imagePreviewClass}`}>
            <img
            className="project-carousel__image-preview__image"
            src={`/img/projects/${image}`}
            alt="Image Preview"/>

            <button
            onClick={() => setImage("")}
            className="project-carousel__image-preview__close-button">
                <span className="fa fa-times" aria-hidden="true"></span>
            </button>
        </div>
    );
}