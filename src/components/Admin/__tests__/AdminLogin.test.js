import { act, Simulate } from "react-dom/test-utils";
import { render } from "react-dom";
import AdminLogin from "../AdminLogin/";

let container;

describe('<AdminLogin/> Component', () => {
    beforeEach(() => {
        fetchMock.doMock();

        container = document.createElement('div');
        document.body.appendChild(container);
    });
    
    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it("It should display an error message", async () => {
        fetch.mockResponse(JSON.stringify(
            {
                status: false,
                error: { message: "Test error" }
            }
        ));

        render(<AdminLogin/>, container);

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

        const p = container.querySelector("p.text-danger");

        expect(p.textContent).toBe("Test error");
    });

    it("It should set the token on local storage and reload the page", async () => {
        const reloadMock = jest.fn();

        Object.defineProperty(window, "location", {
            value: {
                reload: reloadMock
            }
        });

        fetch.mockResponse(JSON.stringify(
            {
                status: true,
                token: "Mock token"
            }
        ));

        render(<AdminLogin/>, container);

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
        expect(reloadMock).toHaveBeenCalledTimes(1);
    });
});