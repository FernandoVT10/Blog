import Layout from "../components/Layout/";
import Navbar from "../components/Navbar/";
import Footer from "../components/Footer/";
import Modal from "../components/Modal";
import ValidationInput from "../components/form/ValidationInput";
import FullScreenLoader from "../components/FullScreenLoader";
import Api from "../ApiController";

import { useState } from "react";

import "../styles/pages/contactme.scss";

export default () => {
    const [email, setEmail] = useState({ value: "", valid: false });
    const [message, setMessage] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = e => {
        e.preventDefault();

        if(email.valid) {
            setLoading(true);

            Api.post("messages/addMessage", { email: email.value, message })
            .then(data => {
                if(data.status) {
                    setModalMessage(data.message);
                } else {
                    setModalMessage("An error has occurred");
                }

                setLoading(false);
            });
        }
    };

    return (
        <Layout title="Contact Me - Fernando Blog">
            <Navbar/>
            <FullScreenLoader loading={loading}/>
            <Modal
            title="Message status"
            active={modalMessage.length > 0}
            onClose={() => setModalMessage("")}>
                <p>{ modalMessage }</p>
            </Modal>

            <div className="body">
                <div className="container-fluid contact-me">
                    <div className="row">
                        <div className="col-12 contact-me__who-is mt-5">
                            <h2 className="title">Who is Fernando Vaca Tamayo?</h2>
                            <p className="contact-me__description">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                                Pariatur, tenetur fugiat accusamus atque reprehenderit ratione
                                magni adipisci quos, quod laborum, hic maxime mollitia voluptatum 
                                a nobis at! Dolorem et nemo id aspernatur doloremque minima,
                                incidunt repellendus, fuga aperiam ut qui consequatur laboriosam, 
                                cumque rem vero magnam.
                                <br/><br/>
                                Harum nihil eius atque ratione at est vero. 
                                Magni laudantium culpa earum magnam aliquid, debitis eaque fugit eos praesentium 
                                deleniti rem sapiente sint at voluptatibus eligendi repellendus 
                                repellat tempora unde sed sequi explicabo temporibus perferendis. 
                                Sint quo dolorem eos animi sapiente. Totam quisquam velit mollitia 
                                cum eaque porro dolorem pariatur, iusto, nostrum incidunt nesciunt.
                                <br/><br/>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                                Pariatur, tenetur fugiat accusamus atque reprehenderit ratione
                                magni adipisci quos, quod laborum, hic maxime mollitia voluptatum 
                                a nobis at! Dolorem et nemo id aspernatur doloremque minima,
                                incidunt repellendus, fuga aperiam ut qui consequatur laboriosam, 
                                cumque rem vero magnam.
                                <br/><br/>
                                Harum nihil eius atque ratione at est vero. 
                                Magni laudantium culpa earum magnam aliquid, debitis eaque fugit eos praesentium 
                                deleniti rem sapiente sint at voluptatibus eligendi repellendus 
                                repellat tempora unde sed sequi explicabo temporibus perferendis. 
                                Sint quo dolorem eos animi sapiente. Totam quisquam velit mollitia 
                                cum eaque porro dolorem pariatur, iusto, nostrum incidunt nesciunt.
                            </p>
                        </div>
                    </div>

                    <div className="row contact-me__form mt-4">
                        <div className="col-6 col-lg-8">
                            <form onSubmit={sendMessage}>
                                <h2 className="title mb-3">Contact Me</h2>

                                <ValidationInput
                                type="email"
                                placeholder="Enter your email"
                                onChange={setEmail} />

                                <textarea
                                className="formulary__textarea mt-3"
                                placeholder="Enter your message"
                                onChange={({ target: { value } }) => setMessage(value)}
                                maxLength="500"
                                rows="5"
                                required></textarea>

                                <button className="submit-button mt-3">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Footer/>
        </Layout>
    );
};