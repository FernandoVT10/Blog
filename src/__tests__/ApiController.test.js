import Api from "../ApiController";

describe("ApiController tests", () => {
   beforeEach(() => {
       fetchMock.resetMocks();
       fetchMock.doMock();
   });

   describe("Post method", () => {
       it("It should return an error", async () => {
            fetch.mockReject(new Error('Fake Error Message'));
            const data = { test: true };

            const api = await Api.post("sendTests", data);

            expect(api).toEqual({ status: false, message: "An error has occurred" });
            expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/api/sendTests", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            });
        });

        it("It should call fetch with body and headers", async () => {
            fetch.mockOnce(JSON.stringify({ status: true }));
            const data = { message: "Test message" };

            const api = await Api.post("sendTests", data);

            expect(api).toEqual({ status: true });
            expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/api/sendTests", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            });
        });

        it("It should call fetch with the Authorization header", async () => {
            fetch.mockOnce(JSON.stringify({ status: true }));

            window.localStorage.setItem("token", "Test token");

            const data = { message: "Test message" };

            const api = await Api.post("admin/sendTests", data, true);

            expect(api).toEqual({ status: true });
            expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/api/admin/sendTests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + window.localStorage.token
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
                "http://localhost:3000/api/getTests",
                {headers: {}}
            );
            
            expect(api).toEqual({ status: false, message: "An error has occurred" });
        });

        it("It should return an array in response", async () => {
            fetch.mockOnce(JSON.stringify([]));

            const api = await Api.get("getTests");

            expect(fetchMock).toHaveBeenCalledWith(
                "http://localhost:3000/api/getTests",
                {headers: {}}
            );
            expect(api).toEqual([]);
        });

        it("It should call fetch with authorization header", async () => {
            fetch.mockOnce(JSON.stringify({ status: true }));

            window.localStorage.setItem("token", "tokenmock");

            const api = await Api.get("getTests", true);

            expect(fetchMock).toHaveBeenCalledWith(
                "http://localhost:3000/api/getTests",
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