import ApiController from "../../services/ApiController";

import { useEmailValidation } from "../../hooks/useEmailValidation";

import { useState } from "react";

export default () => {
    const [email, setEmail] = useEmailValidation();

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const suscribe = e => {
        e.preventDefault();

        if(!email.error) {
            setLoading(true);
            setError("");

            ApiController.post("subscribe", { email: email.value })
            .then(res => {
                if(res.errors) {
                    setError(res.errors[0].message);
                } else {
                    setSuccess(res.data.message);
                }

                setLoading(false);
            });
        }
    };

    if(loading) {
        return (
            <div className="main-footer__subscription-form-loader">
                <span className="spinner-border"></span>
            </div>
        );
    }

    if(!success) {
        const inputClass = error || email.error ? "formulary__input--error" : "";
        const labelClass = error || email.error ? "formulary__error-label--error" : "";

        return (
            <form onSubmit={suscribe}>
                <div className="formulary__input-container">
                    <input
                    id={`subscribe-input`}
                    type="email"
                    className={`formulary__input ${inputClass}`}
                    onChange={({ target: { value } }) => setEmail(value)}
                    value={email.value}
                    placeholder="Enter your email"
                    autoComplete="email"
                    maxLength="100"
                    required/>

                    <label
                    className={`formulary__error-label ${labelClass} mt-2`}
                    htmlFor={`subscribe-input`}>
                        <i className="fas fa-info-circle mr-1" aria-hidden="true"></i>
                        { error || email.error }
                    </label>
                </div>

                <button
                className="formulary__submit-button mt-3"
                disabled={loading}>
                    Suscribe
                </button>
            </form>
        );
    }
    
    return (
        <p className="main-footer__text m-0">
            { success }
        </p>
    );
}