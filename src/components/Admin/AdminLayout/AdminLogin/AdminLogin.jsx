import ApiController from "../../../../services/ApiController";

import { useState } from "react";

import "./AdminLogin.scss";

export default ({ setIsAuthenticated }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleForm = e => {
        e.preventDefault();

        setErrorMessage("");
        setLoading(true);

        ApiController.post("users/login/", { username, password })
        .then(res => {
            if(res.data) {
                window.localStorage.setItem("token", res.data.token);

                setIsAuthenticated(true);
            } else {
                setErrorMessage(res.errors[0].message);
            }

            setLoading(false);
        });
    };

    return (
        <div className="admin-login">
            <div className="admin-login__form-container">
                <form onSubmit={handleForm}>
                    <h2 className="admin-login__title">Contact Me</h2>

                    <input
                    type="text"
                    className="formulary__input admin-login__input"
                    placeholder="Username"
                    autoComplete="username"
                    onChange={({ target: { value } }) => setUsername(value)}
                    required />

                    <input
                    type="password"
                    className="formulary__input admin-login__input"
                    placeholder="Password"
                    autoComplete="password"
                    onChange={({ target: { value } }) => setPassword(value)}
                    required />

                    { errorMessage &&
                        <p className="formulary__message formulary__message--error">
                            <i className="fas fa-times-circle mr-2" aria-hidden="true"></i>
                            { errorMessage }
                        </p>
                    }

                    { loading ?
                        <div className="admin-login__loader">
                            <span className="spinner-border"></span>
                        </div>
                        :
                        <div className="admin-login__submit-button-container">
                            <button className="formulary__submit-button text-center">
                                Login
                            </button>
                        </div>
                    }
                </form>
            </div>
        </div>
    );
};