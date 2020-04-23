import "../../styles/components/form/textarea.scss";

export default ({ placeholder, onChange, maxLength="500", prefix="" }) => {
    return (
        <textarea
        id={`${prefix}-textarea`}
        className="textarea"
        placeholder={placeholder}
        onChange={({ target: { value } }) => onChange(value)}
        maxLength={maxLength}
        rows="5"
        required></textarea>
    );
}