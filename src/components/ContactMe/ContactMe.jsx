import Modal from "../Modal";
import FullScreenLoader from "../FullScreenLoader";

import { useState } from "react";

import "./ContactMe.scss";
import ContactMeForm from "./ContactMeForm";

export default () => {
    const [modalMessage, setModalMessage] = useState("");
    const [loading, setLoading] = useState(false);

    return (
        <div>
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
                            </p>
                        </div>
                    </div>

                    <div className="row contact-me__form mt-4">
                        <div className="col-12 col-lg-8">
                            <ContactMeForm
                            setLoading={setLoading} 
                            setModalMessage={setModalMessage} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}