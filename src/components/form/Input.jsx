import { useState } from "react";

import "../../styles/components/form/input.scss";

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

    const inputClass = error ? "input-container__input--error" : "";
    const labelClass = error ? "input-container__label--error" : "";

    return (
        <div className="input-container">
            <input
            id={`${prefix}-input`}
            type={type}
            className={`input-container__input ${inputClass}`}
            onChange={validate}
            placeholder={placeholder}
            autoComplete={type}
            maxLength={maxLength}
            required/>

            <label
            className={`input-container__label mt-2 ${labelClass}`}
            htmlFor={`${prefix}-input`}>
                <i className="fas fa-info-circle mr-1" aria-hidden="true"></i>

                { error }
            </label>
        </div>
    );
};