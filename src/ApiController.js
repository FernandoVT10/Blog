import fetch from "node-fetch";

export default {
    post(url, data, secure = false) {
        const headers = {
            "Content-Type": "application/json"
        };

        if(secure) {
            Object.assign(headers, {
                "Authorization": "Bearer " + window.localStorage.token
            });
        }

        return fetch(`http://localhost:3000/api/${url}`, {
            method: "POST",
            headers,
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .catch(() => ({ result: false, message: "An error has occurred" }));
    },
    get(url, secure = false) {
        return fetch(`http://localhost:3000/api/${url}`)
        .then(res => res.json())
        .catch(() => ({ result: false, message: "An error has occurred" }));
    }
};