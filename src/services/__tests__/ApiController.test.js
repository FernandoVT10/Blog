import Api from "../ApiController";

describe("ApiController tests", () => {
   beforeEach(() => {
       window.localStorage.clear();
       fetchMock.resetMocks();
       fetchMock.doMock();
   });

   describe("FetchCall method", () => {
        it("It should return an error", async () => {
            fetch.mockReject(new Error('Fake Error Message'));
            const data = { test: true };

            const api = await Api.fetchCall("sendTests", data, "GET");

            expect(api).toEqual({
                errors: [
                    {
                        status: 500,
                        message: "An error has occurred in the server. Please try again later."
                    }
                ]
            });

            expect(fetchMock).toHaveBeenCalledWith(WEBSITE_URL + "api/sendTests", {
                method: "GET",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            });
        });

        it("It should call fetch with body and Authorization header", async () => {
            fetch.mockOnce(JSON.stringify({ status: true }));

            window.localStorage.setItem("token", "Test token");

            const data = { message: "Test message" };

            const api = await Api.fetchCall("sendTests", data, "POST", true);

            expect(api).toEqual({ status: true });
            expect(fetchMock).toHaveBeenCalledWith(WEBSITE_URL + "api/sendTests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer Test token"
                },
                body: JSON.stringify(data)
            });
        });

        it("It should call fetch with FormData and Authorization header", async () => {
            fetch.mockOnce(JSON.stringify({ status: true }));

            window.localStorage.setItem("token", "Test token");
            
            const formData = new FormData();
            formData.append("message", "Test message");

            const api = await Api.fetchCall("sendTests", formData, "POST", true, true);

            expect(api).toEqual({ status: true });
            expect(fetchMock).toHaveBeenCalledWith(WEBSITE_URL + "api/sendTests", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer Test token"
                },
                body: formData
            });
        });
   });

   describe("Post method", () => {
       it("It should call fetchCall with method POST", async () => {
            fetch.mockOnce(JSON.stringify({ status: true }));

            window.localStorage.setItem("token", "postmethod");
            
            const formData = new FormData();
            formData.append("message", "Test message");

            await Api.post("sendTests", formData, true, true);

            expect(fetchMock).toHaveBeenCalledWith(WEBSITE_URL + "api/sendTests", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer postmethod"
                },
                body: formData
            });
        });
   });

   describe("Put method", () => {
        it("It should call fetchCall with method Put", async () => {
            fetch.mockOnce(JSON.stringify({ status: true }));

            window.localStorage.setItem("token", "putmethod");
            
            const data = { message: "hola" }

            await Api.post("sendTests", data, true);

            expect(fetchMock).toHaveBeenCalledWith(WEBSITE_URL + "api/sendTests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer putmethod"
                },
                body: JSON.stringify(data)
            });
        });
    });

   describe("Delete method", () => {
        it("It should call fetchCall with method DELETE", async () => {
            fetch.mockOnce(JSON.stringify({ status: true }));

            window.localStorage.setItem("token", "deletemethod");

            const data = { articleId: 7 };

            await Api.delete("sendTests", data, true);

            expect(fetchMock).toHaveBeenCalledWith(WEBSITE_URL + "api/sendTests", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer deletemethod"
                },
                body: JSON.stringify(data)
            });
        });
    });

   describe("Get method", () => {
        it("It should return an error", async () => {
            fetch.mockReject(new Error('Fake Error Message'));

            const api = await Api.get("getTests");

            expect(fetchMock).toHaveBeenCalledWith(
                WEBSITE_URL + "api/getTests",
                {headers: {}}
            );
            
            expect(api).toEqual({
                errors: [
                    {
                        status: 500,
                        message: "An error has occurred in the server. Please try again later."
                    }
                ]
            });
        });

        it("It should return an array in response", async () => {
            fetch.mockOnce(JSON.stringify([]));

            const api = await Api.get("getTests");

            expect(fetchMock).toHaveBeenCalledWith(
                WEBSITE_URL + "api/getTests",
                {headers: {}}
            );
            expect(api).toEqual([]);
        });

        it("It should call fetch with authorization header", async () => {
            fetch.mockOnce(JSON.stringify({ status: true }));

            window.localStorage.setItem("token", "tokenmock");

            const api = await Api.get("getTests", true);

            expect(fetchMock).toHaveBeenCalledWith(
                WEBSITE_URL + "api/getTests",
                {
                    headers: {
                        "Authorization": "Bearer tokenmock"
                    }
                }
            );

            expect(api).toEqual({ status: true });
        });
   });
});