import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import SubscribeForm from "../SubscribeForm";

let container;

describe("<SubscribeForm/> component", () => {
    beforeEach(() => {
        fetchMock.doMock();

        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;

        fetchMock.mockReset();
    });

    it("It should display an email validation error", () => {
        render(<SubscribeForm/>, container);

        const input = document.querySelector("input");
        const form = document.querySelector("form");

        act(() => {
            input.value = "Test value";
            Simulate.change(input);
        });

        act(() => Simulate.submit(form));

        const label = document.querySelector("label");
        
        expect(label.textContent).toBe("The email is invalid");
        expect(label.classList.contains("formulary__error-label--error")).toBeTruthy();
    });

    it("It should call the api correctly", async () => {
        render(<SubscribeForm/>, container);

        const input = document.querySelector("input");
        const form = document.querySelector("form");

        act(() => {
            input.value = "example@gmail.com";
            Simulate.change(input);
        });

        fetchMock.mockOnce(JSON.stringify({
            data: {
                message: "OK"
            }
        }));

        await act(async () => Simulate.submit(form));

        const fecthCall = fetchMock.mock.calls[0];
        expect(fecthCall[0]).toBe(WEBSITE_URL + "api/subscribe");
        expect(fecthCall[1]).toEqual({
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: "example@gmail.com" })
        });

        const p = document.querySelector("p");
        expect(p.textContent).toBe("OK");
    });

    it("It should display an error when we call the api", async () => {
        render(<SubscribeForm/>, container);

        const input = document.querySelector("input");
        const form = document.querySelector("form");

        act(() => {
            input.value = "example@gmail.com";
            Simulate.change(input);
        });

        fetchMock.mockOnce(JSON.stringify({
            errors: [
                {
                    status: 500,
                    message: "Server Error"
                }
            ]
        }));

        await act(async () => Simulate.submit(form));

        const label = document.querySelector("label");
        expect(label.textContent).toBe("Server Error");
    });
});