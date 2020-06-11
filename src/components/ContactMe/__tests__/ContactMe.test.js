import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import ContactMe from "../ContactMe";

let container;

describe("<ContactMe/> Component", () => {
    beforeEach(() => {
        fetchMock.doMock();

        fetchMock.mockOnce(JSON.stringify({
            status: true,
            message: "Test success message"
        }));
        
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it("It should show a modal when we send a message", async () => {
        render(<ContactMe />, container);

        const input = container.querySelector("input");
        const textarea = container.querySelector("textarea");

        act(() => {
            input.value = "test@gmail.com";
            Simulate.change(input);

            textarea.value = "This is a test message";
            Simulate.change(textarea);
        });

        const form = container.querySelector("form");

        await act(async () => {
            Simulate.submit(form);
        });

        const p = container.querySelector(".modal__body p");

        expect(p.textContent).toBe("Test success message");
    });
});