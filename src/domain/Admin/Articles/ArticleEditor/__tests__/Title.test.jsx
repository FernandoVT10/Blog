import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import Title from "../Title";

let container;

window.addEventListener = jest.fn();

describe("<Title/> component", () => {
    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        window.addEventListener.mockReset();

        document.body.removeChild(container);
        container = null;
    });

    it("should add a resize event listener to window", async () => {
        act(() => {
            render(<Title/>, container);
        });

        expect(window.addEventListener).toBeCalledWith("resize", expect.any(Function));
    });

    it("should resize the textarea", async () => {
        const onChangeTitleMock = jest.fn();
        
        act(() => {
            render(<Title title="" onChangeTitle={onChangeTitleMock} />, container);
        });

        const textareaObjectMock = {
            style: {
                height: "0px"
            },
            value: "Test",
            scrollHeight: 100
        };

        document.getElementById = jest.fn(() => textareaObjectMock);

        act(() => {
            const textarea = container.querySelector("textarea");
            Simulate.change(textarea);
        });

        expect(onChangeTitleMock).toBeCalledWith("Test");
        expect(document.getElementById).toBeCalledWith("article-editor-title");
        expect(textareaObjectMock.style.height).toBe("100px");
    });
});