import fetch from "node-fetch";

const API_URL = "/api/";

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
        .catch(() => {
            return {
                errors: [
                    {
                        status: 500,
                        message: "An error has occurred in the server. Please try again later."
                    }
                ]
            };
        });
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
        .catch(() => {
            return {
                errors: [
                    {
                        status: 500,
                        message: "An error has occurred in the server. Please try again later."
                    }
                ]
            };
        });
    },

    post(url, data, secure = false, isFormData = false) {
        return this.fetchCall(url, data, "POST", secure, isFormData);
    },

    put(url, data = {}, secure = false, isFormData = false) {
        return this.fetchCall(url, data, "PUT", secure, isFormData);
    },

    delete(url, data = {}, secure = true) {
        return this.fetchCall(url, data, "DELETE", secure);
    }
};