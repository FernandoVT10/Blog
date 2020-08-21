import Modal from "@components/Modal";

import ApiController from "@services/ApiController";

import { useState, useEffect } from "react";

import "./ReplyMessage.scss";

const ReplyMessage = ({ message, setActiveMessage }) => {
    const [replyMessage, setReplyMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [modalActive, setModalActive] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(message.email) {
            setModalActive(true);
        } else {
            setModalActive(false);
        }
    }, [message])

    const onCloseModal = () => {
        setModalActive(false);
        setReplyMessage("");
        setErrorMessage("");
        setSuccessMessage("");
        setActiveMessage({});
    }

    const handleButton = () => {
        const data = {
            message: replyMessage,
            email: message.email
        };

        setErrorMessage("");
        setSuccessMessage("");
        setLoading(true);

        ApiController.post("messages/replyMessage/", data, true)
        .then(res => {
            if(res.data) {
                setSuccessMessage(res.data.message);
            } else if(res.errors) {
                setErrorMessage(res.errors[0].message);
            }

            setLoading(false);
        });
    }

    const getButtons = () => {
        if(loading) {
            return (
              <div className="admin-messages-reply-message__loader">
                  <span className="spinner-border"></span>
              </div>  
            );
        }

        if(successMessage) {
            return (
                <p className="formulary__message formulary__message--success">
                    <i className="fas fa-check-circle mr-2" aria-hidden="true"></i>
                    { successMessage }
                </p>
            );
        }

        return (
            <div>
                { errorMessage &&
                    <p className="formulary__message formulary__message--error">
                        <i className="fas fa-times-circle mr-2" aria-hidden="true"></i>
                        { errorMessage }
                    </p>
                }

                <button
                className="custom-button custom-button--save"
                onClick={handleButton}>
                    <i className="fas fa-paper-plane"></i>
                    Send
                </button>
                <button
                className="custom-button custom-button--cancel"
                onClick={() => setModalActive(false)}>
                    <i className="fas fa-trash"></i>
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <Modal
        title={`Reply to ${message.email}`}
        active={modalActive}
        onClose={onCloseModal}
        prefix="reply-email">
            <div className="admin-messages-reply-message">
                <div className="admin-messages-reply-message__message">
                    { message.message }
                </div>

                <textarea
                className="formulary__textarea admin-messages-reply-message__textarea"
                placeholder="Enter a reply"
                onChange={({ target: { value } }) => setReplyMessage(value)}
                value={replyMessage}
                rows="4"></textarea>

                { getButtons() }
            </div>
        </Modal>
    );
}

export default ReplyMessage;