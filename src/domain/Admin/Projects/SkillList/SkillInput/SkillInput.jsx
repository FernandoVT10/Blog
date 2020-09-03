import "./SkillInput.scss";

const SkillInput = ({ onSubmit, skillName, setSkillName, onBlur }) => {
    return (
        <div className="admin-skill-list-skill-input">
            <form onSubmit={onSubmit}>
                <input
                type="text"
                className="admin-skill-list-skill-input__input"
                value={skillName}
                onChange={({ target: { value } }) => setSkillName(value)}
                onBlur={onBlur}
                autoFocus={true}/>
                <div className="admin-skill-list-skill-input__background"></div>
            </form>
        </div>
    );
}

export default SkillInput;