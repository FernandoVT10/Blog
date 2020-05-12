import { act, Simulate } from "react-dom/test-utils";
import { render } from "react-dom";
import ContactMe from "../contact-me";

let container;

describe("Contact Me page", () => {
    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });
    
    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it('Check if renders correctly', () => {
        render(<ContactMe/>, container);

        expect(container).toMatchSnapshot();
    });

    it("It should show the modal with a message", async () => {
        render(<ContactMe/>, container);

        const input = container.querySelector("input");
        const textarea = container.querySelector("textarea");

        act(() => {
            input.value = "test@gmail.com";
            textarea.value = "Test message";

            Simulate.change(input);
            Simulate.change(textarea);
        });

        fetchMock.doMock();
        fetchMock.mockOnce(JSON.stringify({
            status: true,
            message: "Test message"
        }));

        const form = container.querySelector("form");

        await act(async () => {
            Simulate.submit(form);
        });

        const p = container.querySelector(".modal-body p");

        expect(p.textContent).toBe("Test message");
    });
});