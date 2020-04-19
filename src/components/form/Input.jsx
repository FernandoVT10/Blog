import { useState } from "react";

import "../../styles/components/form/input.scss";

export default ({ type, placeholder, onChange }) => {
    const id = Math.random().toString(36);
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
            id={id}
            type={type}
            className={`input-container__input ${inputClass}`}
            onChange={validate}
            placeholder={placeholder}/>

            <label className={`input-container__label mt-2 ${labelClass}`} htmlFor={id}>
                <i className="fas fa-info-circle mr-1" aria-hidden="true"></i>

                { error }
            </label>
        </div>
    );
};