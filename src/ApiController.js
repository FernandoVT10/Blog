import fetch from "node-fetch";

export default {
    fetchCall(url, data, method, authorizationHeader = false) {
        const headers = {
            "Content-Type": "application/json"
        };

        if(authorizationHeader) {
            Object.assign(headers, {
                "Authorization": "Bearer " + window.localStorage.token
            });
        }
        
        return fetch(`http://localhost:3000/api/${url}`, {
            method,
            headers,
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .catch(() => (
            {
                status: false,
                error: {
                    message: "An error has occurred"
                }
            }
        ));
    },

    post(url, data, secure = false) {
        return this.fetchCall(url, data, "POST", secure);
    },

    get(url, secure = false) {
        const headers = {};

        if(secure) {
            Object.assign(headers, {
                "Authorization": "Bearer " + window.localStorage.token
            });
        }

        return fetch(`http://localhost:3000/api/${url}`, {
            headers
        })
        .then(res => res.json())
        .catch(() => (
            {
                status: false,
                error: {
                    message: "An error has occurred"
                }
            }
        ));
    },

    delete(url, data, secure = true) {
        return this.fetchCall(url, data, "DELETE", secure);
    },

    put(url, data, secure = true) {
        return this.fetchCall(url, data, "PUT", secure);
    }
};