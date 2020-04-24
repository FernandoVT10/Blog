import { useState } from "react";

export default ({ type, placeholder, onChange, maxLength="100", prefix="" }) => {
    const [error, setError] = useState("");

    const validate = ({ target: { value } }) => {
        if(type === "email") {
            if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
                onChange({value, valid: false});
                setError("The email is invalid");
                return;
            }
        }

        onChange({value, valid: true});
        setError("");
    };

    const inputClass = error ? "formulary__input--error" : "";
    const labelClass = error ? "formulary__error-label--error" : "";

    return (
        <div className="formulary__input-container">
            <input
            id={`${prefix}-input`}
            type={type}
            className={`formulary__input ${inputClass}`}
            onChange={validate}
            placeholder={placeholder}
            autoComplete={type}
            maxLength={maxLength}
            required/>

            <label
            className={`formulary__error-label mt-2 ${labelClass}`}
            htmlFor={`${prefix}-input`}>
                <i className="fas fa-info-circle mr-1" aria-hidden="true"></i>

                { error }
            </label>
        </div>
    );
};