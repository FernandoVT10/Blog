import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import ReplyMessage from "../ReplyMessage";

const MESSAGE_MOCK = {
    _id: 1,
    message: "test",
    email: "test@example.com",
    viewed: true
};

jest.mock("@/components/Modal", () => {
    return ({ children, onClose, active }) => {
        const modalClass = active ? "active" : "";

        return (
            <div className={`test-modal ${modalClass}`}>
                <button className="test-modal-onClose" onClick={onClose}></button>
                { children }
            </div>
        );
    }
});

let container;

describe("Admin Messages <ReplyMessage/> component", () => {
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

    it("should activate and desactivate the modal", () => {
        act(() => {
            render(
                <ReplyMessage
                message={{}}
                setActiveMessage={() => {}}/>
            , container);
        });

        const modal = container.querySelector(".test-modal");

        expect(modal.classList.contains("active")).toBeFalsy();

        act(() => {
            render(
                <ReplyMessage
                message={MESSAGE_MOCK}
                setActiveMessage={() => {}}/>
            , container);
        });

        expect(modal.classList.contains("active")).toBeTruthy();
    });

    it("should call the api correctly and display a success message", async () => {
        act(() => {
            render(
                <ReplyMessage
                message={MESSAGE_MOCK}
                setActiveMessage={() => {}}/>
            , container);
        });

        const textarea = container.querySelector("textarea");

        act(() => {
            textarea.value = "Test message";
            Simulate.change(textarea);
        });

        fetchMock.mockOnce(JSON.stringify({
            data: {
                message: "Test success message"
            }
        }));

        const button = container.querySelector(".custom-button--save");
        await act(async () => Simulate.click(button));

        const fetchCall = fetchMock.mock.calls[0];
        const body = JSON.stringify({
            message: "Test message",
            email: MESSAGE_MOCK.email
        });

        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/messages/replyMessage/");
        expect(fetchCall[1].method).toBe("POST");
        expect(fetchCall[1].body).toBe(body);

        const successMessage = container.querySelector(".formulary__message--success");
        expect(successMessage.textContent).toBe("Test success message");
    });

    it("should display an API error", async () => {
        act(() => {
            render(
                <ReplyMessage
                message={{}}
                setActiveMessage={() => {}}/>
            , container);
        });

        fetchMock.mockOnce(JSON.stringify({
            errors: [
                { message: "Test error message" }
            ]
        }));

        const button = container.querySelector(".custom-button--save");
        await act(async () => Simulate.click(button));

        const errorMessage = container.querySelector(".formulary__message--error");
        expect(errorMessage.textContent).toBe("Test error message");
    });

    it("should call setActiveMessage", async () => {
        const setActiveMessageMock = jest.fn();

        act(() => {
            render(
                <ReplyMessage
                message={MESSAGE_MOCK}
                setActiveMessage={setActiveMessageMock}/>
            , container);
        });

        fetchMock.mockOnce(JSON.stringify({
            errors: [
                { message: "Test error message" }
            ]
        }));

        const saveButton = container.querySelector(".custom-button--save");
        await act(async () => Simulate.click(saveButton));

        expect(container.querySelector(".formulary__message--error")).not.toBeNull();

        const onClosebutton = container.querySelector(".test-modal-onClose");
        act(() => Simulate.click(onClosebutton));

        expect(container.querySelector(".formulary__message--error")).toBeNull();

        expect(setActiveMessageMock).toHaveBeenCalledWith({});
    });
});