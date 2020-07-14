import ApiController from "../../../services/ApiController";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import "./ConfirmSubscription.scss";

export default () => {
    const [message, setMessage] = useState("");
    const router = useRouter();

    useEffect(() => {
        const { subscriptionId } = router.query;

        if(subscriptionId && !message) {
            ApiController.put(`subscribe/${subscriptionId}/confirm/`)
            .then(res => {
                if(res.errors) {
                    setMessage("The subscription is invalid");
                } else {
                    setMessage(res.data.message);
                }
            });
        }
    }, [router.query]);

    const divClass = message ? "home-confirm-subscription--active" : "";

    return (
        <div className={`home-confirm-subscription ${divClass}`}>
            { message }
        </div>
    );
}