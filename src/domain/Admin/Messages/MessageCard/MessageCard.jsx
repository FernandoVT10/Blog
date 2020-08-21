import "./MessageCard.scss";

const MessageCard = ({ message, setActiveMessage, activeViewed }) => {
    const messageCardClass = message.viewed ? "admin-messages-message-card--viewed" : "";

    const handleClick = () => {
        setActiveMessage(message);

        if(!message.viewed) {
            activeViewed(message._id);
        }
    }

    return (
        <div
        onClick={handleClick}
        className={`admin-messages-message-card ${messageCardClass}`}>
            <div className="admin-messages-message-card__email">
                { message.email }
            </div>

            <div className="admin-messages-message-card__message">
                { message.message }
            </div>
        </div>
    );
}

export default MessageCard;