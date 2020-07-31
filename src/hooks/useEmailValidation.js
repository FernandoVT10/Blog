import { useState, useEffect } from "react";

const emailRegex =  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export function useEmailValidation() {
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        if(email && !emailRegex.test(email)) {
            setError("The email is invalid");
        } else {
            setError("");
        }
    }, [email]);

    return [{ error, value: email }, setEmail];
}