import Link from "next/link";
import Input from "./form/Input";
import { useState } from "react";

import "../styles/components/footer.scss";

export default () => {
    const [email, setEmail] = useState({value: "", valid: false});

    const suscribe = e => {
        e.preventDefault();

        if(email.valid) {
            alert("holu");
        }
    };

    return (
        <footer className="main-footer container-fluid mt-4">
            <div className="row">
                <div className="col-12 col-sm-6 col-xl-3">
                    <Link href="/">
                        <a className="main-footer__brand">
                            <img
                            src="favicon.ico"
                            width="50"
                            height="50"
                            className="d-inline-block align-top rounded-circle"
                            alt="Icon" />
                            <h3 className="main-footer__title">
                                Fernando Vaca Tamayo
                            </h3>
                        </a>
                    </Link>

                    <div className="mt-4">
                        <h3 className="main-footer__subtitle">
                            Contact Me
                        </h3>

                        <p>
                            <i
                            className="fas fa-envelope main-footer__icon"
                            aria-hidden="true"></i>

                            <span className="main-footer__text">
                                mailexample@gmail.com
                            </span>
                        </p>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <h3 className="main-footer__subtitle">
                        Social Networks
                    </h3>

                    <a href="https://twitter.com/FernandoVT10" target="_blank">
                        <p>
                            <i
                            className="fab fa-twitter main-footer__icon"
                            aria-hidden="true"></i>

                            <span className="main-footer__text">
                                @FernandoVT10
                            </span>
                        </p>
                    </a>

                    <a href="https://github.com/FernandoVT10" target="_blank">
                        <p>
                            <i
                            className="fab fa-github main-footer__icon"
                            aria-hidden="true"></i>

                            <span className="main-footer__text">
                                FernandoVT10
                            </span>
                        </p>
                    </a>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <h3 className="main-footer__subtitle">
                        Description
                    </h3>

                    <p className="main-footer__description">
                        This blog is my personal blog xD
                    </p>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <h3 className="main-footer__subtitle">
                        Suscribe to my blog
                    </h3>

                    <form onSubmit={suscribe}>
                        <Input
                        type="email"
                        placeholder="Enter your email"
                        onChange={setEmail} />

                        <button className="submit-button">
                            Suscribe
                        </button>
                    </form>
                </div>
            </div>
        </footer>
    );
};