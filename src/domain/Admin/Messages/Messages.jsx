import MessageCard from "./MessageCard";
import ReplyMessage from "./ReplyMessage";

import ApiController from "@services/ApiController";

import { useEffect, useState } from "react";

import "./Messages.scss";

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [activeMessage, setActiveMessage] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        ApiController.get("messages", true)
        .then(res => {
            if(res.data) {
                setMessages(res.data.messages);
            }

            setLoading(false);
        });
    }, []);

    const activeViewed = messageId => {
        ApiController.put(`messages/${messageId}`, { viewed: true }, true)
        .then(() => {
            setMessages(messages.map(message => {
                if(message._id === messageId) {
                    message.viewed = true;
                }

                return message;
            }));
        });
    }

    const getMessages = () => {
        if(loading) {
            return (
                <div className="admin-messages__container">
                    <span className="spinner-border"></span>
                </div>
            );
        }

        if(!messages.length) {
            return (
                <div className="admin-messages__container">
                    There is not messages available
                </div>
            );
        }

        return messages.map(message => {
            return (
                <MessageCard
                setActiveMessage={setActiveMessage}
                activeViewed={activeViewed}
                message={message}
                key={message._id}/>
            );
        });
    }

    return (
        <div className="container-fluid admin-messages">
            <ReplyMessage message={activeMessage} setActiveMessage={setActiveMessage}/>

            <div className="row">
                <div className="col-12">
                    <div className="admin-messages__title-wrapper">
                        <h2 className="admin-messages__title">Messages</h2>
                    </div>
                </div>

                <div className="col-12">
                    { getMessages() }
                </div>
            </div>
        </div>
    );
}

export default Messages;