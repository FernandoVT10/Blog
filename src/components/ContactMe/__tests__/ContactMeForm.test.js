import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import ContactMeForm from "../ContactMeForm";

const setLoading = jest.fn();
const setModalMessage = jest.fn();

let container;

describe("<ContactMeForm /> component", () => {
    beforeEach(() => {
        fetchMock.doMock();

        setLoading.mockReset();
        setModalMessage.mockReset();

        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it("It should send the message to the server", async () => {
        fetchMock.mockOnce(JSON.stringify({
            status: true,
            message: "Test success message"
        }));

        render(
            <ContactMeForm
            setLoading={setLoading}
            setModalMessage={setModalMessage} />,
        container);

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

        expect(setLoading).toHaveBeenCalledTimes(2);
        expect(setModalMessage).toHaveBeenCalledWith("Test success message");
    });

    it("It should send call to the setModalMessage with an error", async () => {
        fetchMock.mockOnce(JSON.stringify({
            status: false
        }));

        render(
            <ContactMeForm
            setLoading={setLoading}
            setModalMessage={setModalMessage} />,
        container);

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

        expect(setLoading).toHaveBeenCalledTimes(2);
        expect(setModalMessage).toHaveBeenCalledWith("An error has occurred");
    });
});
