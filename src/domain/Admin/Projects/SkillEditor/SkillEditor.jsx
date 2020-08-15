import ImageEditor from "../../../../components/ImageEditor";

import "./SkillEditor.scss";

export default (props) => {
    if(props.loading) {
        return (
            <div className="skill-editor">
                <div className="skill-editor__container">
                    <span className="spinner-border"></span>
                </div>
            </div>
        );
    }

    if(props.skillNotFound) {
        return (
            <div className="skill-editor">
                <div className="skill-editor__container">
                    The skill doesn't exist
                </div>
            </div>
        );
    }

    return (
        <div className="skill-editor">
            <input
            type="text"
            value={props.name}
            maxLength="50"
            onChange={({ target: { value } }) => props.setName(value)}
            placeholder="Enter a name"
            className="formulary__input skill-editor__input"/>

            <ImageEditor image={props.image} onChangeImage={props.setImageFile} />
            
            <label
            htmlFor="input-color"
            className="skill-editor__color-label"
            style={{ background: props.color }}>
                Skill Color
            </label>

            <input
            type="color"
            value={props.color}
            id="input-color"
            onChange={({ target: { value } }) => props.setColor(value)}
            className="skill-editor__color-input"/>

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