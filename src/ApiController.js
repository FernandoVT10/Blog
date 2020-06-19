import fetch from "node-fetch";

const API_URL = "http://localhost:3000/api/";

export default {
    fetchCall(url, data, method, authorizationHeader = false, isFormData = false) {
        const headers = {};

        if(!isFormData) {
            data = JSON.stringify(data);

            Object.assign(headers, {
                "Content-Type": "application/json"
            });
        }

        if(authorizationHeader) {
            Object.assign(headers, {
                "Authorization": "Bearer " + window.localStorage.token
            });
        }
        
        return fetch(API_URL + url, {
            method,
            headers,
            body: data
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

    post(url, data, secure = false, isFormData = false) {
        return this.fetchCall(url, data, "POST", secure, isFormData);
    },

    get(url, secure = false) {
        const headers = {};

        if(secure) {
            Object.assign(headers, {
                "Authorization": "Bearer " + window.localStorage.token
            });
        }

        return fetch(API_URL + url, {
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
    }
};