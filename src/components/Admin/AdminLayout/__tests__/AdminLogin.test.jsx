import { act, Simulate } from "react-dom/test-utils";
import { render } from "react-dom";
import AdminLogin from "../AdminLogin/";

let container;

describe("<AdminLogin/> Component", () => {
    beforeEach(() => {
        fetchMock.doMock();

        container = document.createElement("div");
        document.body.appendChild(container);
    });
    
    afterEach(() => {
        fetchMock.mockReset();
        window.localStorage.removeItem("token")

        document.body.removeChild(container);
        container = null;
    });

    it("should call the api and send the data correctly", async () => {
        fetch.mockResponse(JSON.stringify(
            {
                data: {
                    token: "Mock token"
                }
            }
        ));

        render(<AdminLogin setIsAuthenticated={() => {}}/>, container);

        const form = container.querySelector("form");
        const inputs = container.querySelectorAll(".formulary__input");

        act(() => {
            inputs[0].value = "user";
            Simulate.change(inputs[0]);

            inputs[1].value = "secret";
            Simulate.change(inputs[1]);
        });

        await act(async () => {
            Simulate.submit(form);
        });

        const fetchCall = fetchMock.mock.calls[0];

        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/users/login/");
        expect(fetchCall[1].method).toBe("POST");
        expect(fetchCall[1].body).toBe(JSON.stringify({
            username: "user",
            password: "secret"
        }));
    });

    it("should display an error message", async () => {
        fetch.mockResponse(JSON.stringify(
            {
                errors: [
                    { message: "Test error" }
                ]
            }
        ));

        render(<AdminLogin setIsAuthenticated={() => {}}/>, container);

        const form = container.querySelector("form");
        const inputs = container.querySelectorAll(".formulary__input");

        act(() => {
            inputs.forEach((input) => {
                input.value = "Test value";
                Simulate.change(input);
            });
        });

        await act(async () => {
            Simulate.submit(form);
        });

        const p = container.querySelector(".formulary__message--error");

        expect(p.textContent).toBe("Test error");
    });

    it("should set the token on local storage and call setIsAuthenticated", async () => {
        const setIsAuthenticatedMock = jest.fn();

        fetch.mockResponse(JSON.stringify(
            {
                data: {
                    token: "Mock token"
                }
            }
        ));

        render(<AdminLogin setIsAuthenticated={setIsAuthenticatedMock}/>, container);

        const form = container.querySelector("form");
        const inputs = container.querySelectorAll(".formulary__input");

        act(() => {
            inputs.forEach((input) => {
                input.value = "Test value";
                Simulate.change(input);
            });
        });

        await act(async () => {
            Simulate.submit(form);
        });

        expect(window.localStorage.getItem("token")).toBe("Mock token");
        expect(setIsAuthenticatedMock).toHaveBeenCalledWith(true);
    });
});