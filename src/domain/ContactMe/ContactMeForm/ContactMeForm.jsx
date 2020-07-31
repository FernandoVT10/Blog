import ApiController from "../../../services/ApiController";

import { useEmailValidation } from "../../../hooks/useEmailValidation";

import { useState } from "react";

import "./ContactMeForm.scss";

export default () => {
    const [email, setEmail] = useEmailValidation();
    const [message, setMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = e => {
        e.preventDefault();

        if(!email.error) {
            setLoading(true);
            setSuccessMessage("");
            setErrorMessage("");

            ApiController.post("messages", { email: email.value, message })
            .then(res => {
                if(res.data) {
                    setSuccessMessage(res.data.message);
                } else {
                    setErrorMessage("An error has occurred");
                }

                setLoading(false);
            });
        }
    };

    if(loading) {
        return (
            <div className="contact-me-form__loader">
                <span className="spinner-border"></span>
            </div>
        );
    }

    if(successMessage) {
        return (
            <p className="contact-me-form__message contact-me-form__message--success">
                <i className="fas fa-check-circle mr-2" aria-hidden="true"></i>
                { successMessage }
            </p>
        );
    }

    const inputClass = email.error ? "formulary__input--error" : "";
    const labelClass = email.error ? "formulary__error-label--error" : "";

    return (
        <form onSubmit={sendMessage}>
            <h2 className="contact-me-form__title">Contact Me</h2>

            <div className="formulary__input-container">
                <input
                id="email"
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
                    { email.error }
                </label>
            </div>

            <textarea
            className="formulary__textarea mt-3"
            placeholder="Enter your message"
            onChange={({ target: { value } }) => setMessage(value)}
            maxLength="500"
            rows="5"
            required></textarea>

            { errorMessage &&
                <p className="contact-me-form__message contact-me-form__message--error">
                    <i className="fas fa-times-circle mr-2" aria-hidden="true"></i>
                    { errorMessage }
                </p>
            }

            <button className="formulary__submit-button contact-me-form__submit-button">
                Send Message
            </button>
        </form>
    );
}