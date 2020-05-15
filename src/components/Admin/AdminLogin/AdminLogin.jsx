import Layout from "../../../components/Layout";
import { useState } from "react";

import "./AdminLogin.scss";
import Api from "../../../ApiController";

export default () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const login = e => {
        e.preventDefault();

        Api.post("users/login/", { username, password })
        .then(data => {
            if(data.status) {
                window.localStorage.setItem("token", data.token);

                window.location.reload();
            } else {
                setErrorMessage(data.error.message);
            }
        });
    };

    return (
        <Layout>
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-6">
                        <form onSubmit={login}>
                            <h2 className="title mb-3">Contact Me</h2>

                            <input
                            type="text"
                            className="formulary__input"
                            placeholder="Username"
                            autoComplete="username"
                            onChange={({ target: { value } }) => setUsername(value)}
                            required />

                            <input
                            type="password"
                            className="formulary__input"
                            placeholder="Password"
                            autoComplete="password"
                            onChange={({ target: { value } }) => setPassword(value)}
                            required />

                            <p className="text-danger">{ errorMessage }</p>

                            <button className="submit-button">
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};