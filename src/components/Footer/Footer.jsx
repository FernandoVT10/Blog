import Link from "next/link";
import ValidationInput from "../form/ValidationInput";
import FullScreenLoader from "../FullScreenLoader/";
import Api from "../../ApiController";
import Modal from "../Modal/";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import "./Footer.scss";
export default () => {
    const [email, setEmail] = useState({value: "", valid: false});
    const [success, setSuccess] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // we check if there is a parameter called subscriptionId
        const { subscriptionId } = router.query;

        if(subscriptionId) {
            setLoading(true);

            // we send the subscription id to the server fto confirm the subscription
            Api.post("suscribe/confirm/", { subscriptionId })
            .then(data => {
                setModalMessage(data.message);

                setLoading(false);
            });
        }
    }, [router.query]);

    const suscribe = e => {
        e.preventDefault();

        setLoading(true);

        if(email.valid) {
            Api.post("suscribe", { email: email.value })
            .then(data => {
                if(data.status) {
                    setSuccess(data.message);
                }

                setLoading(false);
            });
        }
    };

    const getSuscribeForm = () => {
        if(!success) {
            return (
                <form onSubmit={suscribe}>
                    <ValidationInput
                    type="email"
                    placeholder="Enter your email"
                    onChange={setEmail} />

                    <button className="submit-button mt-3">
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
    };

    return (
        <footer className="main-footer container-fluid mt-4">
            <FullScreenLoader loading={loading}/>
            <Modal
            title="Suscription confirm status"
            active={modalMessage.length > 0}>
                <p>{ modalMessage }</p>
            </Modal>

            <div className="row">
                <div className="col-12 col-sm-6 col-xl-3">
                    <Link href="/">
                        <a className="main-footer__brand">
                            <img
                            src="/favicon.ico"
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
                                vacatamayo321@gmail.com
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

                    { getSuscribeForm() }
                </div>
            </div>
        </footer>
    );
};