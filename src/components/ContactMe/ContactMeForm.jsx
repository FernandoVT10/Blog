import ValidationInput from "../form/ValidationInput";
import Api from "../../ApiController";

import { useState } from "react";

export default ({ setModalMessage, setLoading }) => {
    const [email, setEmail] = useState({ value: "", valid: false });
    const [message, setMessage] = useState("");

    const sendMessage = e => {
        e.preventDefault();
        e.target.reset();

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
    );
}