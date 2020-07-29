import { render } from "react-dom";
import { act } from "react-dom/test-utils";
import Modal from "../Modal";

let container;

describe("<Modal/> component", () => {
    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it("It should render the title and chidren", () => {
        render(
        <Modal title="Test title" onClose={jest.fn()} prefix="testid">
            <span className="test-span">This is a test</span>
        </Modal>, container);

        const title = container.querySelector("h2");
        const testSpan = container.querySelector(".test-span");

        expect(title.textContent).toBe("Test title");
        expect(testSpan.textContent).toBe("This is a test");
    });

    it("It should render the modal with the id testid-modal", () => {
        render(
        <Modal title="Test title" onClose={jest.fn()} prefix="testid">
            Test modal
        </Modal>, container);

        const modal = container.querySelector("#testid-modal");

        expect(modal.classList.contains("modal")).toBeTruthy();
    });

    it("It show or hide the modal when we change the active prop", () => {
        const modal = jest.fn();

        window.$ = () => ({ on: jest.fn(), modal });

        act(() => {
            render(
            <Modal title="Test title" active={true} onClose={jest.fn()} prefix="testid">
                Test modal
            </Modal>, container);
        });

        expect(modal).toHaveBeenCalledWith("show");

        act(() => {
            render(
            <Modal title="Test title" active={false} onClose={jest.fn()} prefix="testid">
                Test modal
            </Modal>, container);
        });

        expect(modal).toHaveBeenCalledWith("hide");
    });

    it("It should call onClose function when we close the modal", () => {
        const onClose = jest.fn();
        const on = jest.fn();

        window.$ = () => ({ on, modal: jest.fn() });

        act(() => {
            render(
            <Modal title="Test title" active={true} onClose={onClose} prefix="testid">
                Test modal
            </Modal>, container);
        });

        // here we execute the function
        on.mock.calls[0][1]();

        expect(on).toHaveBeenCalledWith("hidden.bs.modal", expect.any(Function));
        expect(onClose).toHaveBeenCalled();
    });
});