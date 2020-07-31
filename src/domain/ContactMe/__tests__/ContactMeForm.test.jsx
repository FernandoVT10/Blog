import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import ContactMeForm from "../ContactMeForm";

let container;

describe("<ContactMeForm /> component", () => {
    beforeEach(() => {
        fetchMock.doMock();

        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        fetchMock.mockReset();

        document.body.removeChild(container);
        container = null;
    });

    it("should send the message to the server correctly", async () => {
        fetchMock.mockOnce(JSON.stringify({
            data: { message: "Test success message" }
        }));

        render(<ContactMeForm/>, container);

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

        const fetchCall = fetchMock.mock.calls[0];

        expect(fetchCall[0]).toBe("http://localhost:3000/api/messages");
        expect(fetchCall[1].body).toBe(JSON.stringify(
            {
                email:"test@gmail.com",
                message:"This is a test message"
            }
        ));
    });

    it("should display a success message", async () => {
        fetchMock.mockOnce(JSON.stringify({
            data: {
                message: "Test success message"
            }
        }));

        render(<ContactMeForm/>, container);

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

        const messageError = container.querySelector(".contact-me-form__message--success");

        expect(messageError.textContent).toBe("Test success message");
    });

    it("should display an error message", async () => {
        fetchMock.mockOnce(JSON.stringify({
            errors: [
                {
                    message: "Test error"
                }
            ]
        }));

        render(<ContactMeForm/>, container);

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

        const messageError = container.querySelector(".contact-me-form__message--error");

        expect(messageError.textContent).toBe("An error has occurred");
    });
});
