import ImagesCarousel from "./ImagesCarousel";
import SkillList from "./SkillList";

import "./ProjectEditor.scss";

export default (props) => {
    if(props.loading) {
        return (
            <div className="project-editor">
                <div className="project-editor__container">
                    <span className="spinner-border"></span>
                </div>
            </div>
        );
    }

    if(props.projectNotFound) {
        return (
            <div className="project-editor">
                <div className="project-editor__container">
                    The project doesn't exist
                </div>
            </div>
        );
    }

    return (
        <div className="project-editor">
            <input
            type="text"
            value={props.title}
            maxLength="50"
            onChange={({ target: { value } }) => props.setTitle(value)}
            placeholder="Enter a title"
            className="formulary__input project-editor__input"/>

            <ImagesCarousel
            imageFiles={props.imageFiles}
            setImageFiles={props.setImageFiles}
            currentImages={props.currentImages}
            setCurrentImages={props.setCurrentImages}
            images={props.images}/>

            <textarea
            rows="3"
            value={props.description}
            maxLength="500"
            onChange={({ target: { value } }) => props.setDescription(value)}
            placeholder="Enter a description"
            className="formulary__textarea project-editor__textarea"></textarea>

            <SkillList skills={props.skills} setSkills={props.setSkills}/>

            { props.errorMessage &&
                <p className="formulary__message formulary__message--error">
                    <i className="fas fa-times-circle mr-2" aria-hidden="true"></i>
                    { props.errorMessage }
                </p>
            }

            <button
            className="custom-button custom-button--save"
            onClick={props.handleButton}>
                <i className="fas fa-folder"></i>
                Save
            </button>
            
            <button
            className="custom-button custom-button--cancel"
            onClick={() => props.setModalActive(false)}>
                <i className="fas fa-trash"></i>
                Cancel
            </button>
        </div>
    );
}