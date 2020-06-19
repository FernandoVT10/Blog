import { render } from "react-dom";
import { act } from "react-dom/test-utils";
import Content from "../Content";
import Quill from "quill";

let container;

jest.mock("quill");

const addHandlerMock = jest.fn();

window.hljs = {
    configure: jest.fn()
};

document.getSelection = jest.fn();

describe("<Content/> component", () => {
    beforeEach(() => {
        Object.getOwnPropertyNames(Quill.prototype).forEach(name => {
            Quill.prototype[name].mockReset();
        });

        addHandlerMock.mockReset();

        Quill.prototype.getModule = jest.fn(() => {
            return {
                addHandler: addHandlerMock
            };
        });

        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it("It should setup the quill editor correctly", async () => {
        await act(async () => {
            render(
                <Content
                editArticle={true}
                content="[]"
                onChangeContent={jest.fn()}/>,
            container);
        });

        const { getModule, on, setContents } = Quill.prototype;

        expect(getModule).toHaveBeenCalledWith("toolbar");
        expect(on).toHaveBeenCalledWith("text-change", expect.any(Function));
        expect(setContents).toBeCalled();
        expect(addHandlerMock).toHaveBeenCalledWith("image", expect.any(Function));
    });

    it("It should enable and disable the editor when we change the editArticle", async () => {
        document.querySelector = () => ({
            classList: {
                add: () => {},
                remove: () => {}
            }
        });

        await act(async () => {
            render(
                <Content
                editArticle={false}
                content="[]"
                onChangeContent={jest.fn()}/>,
            container);
        });

        await act(async () => {
            render(
                <Content
                editArticle={true}
                content="[]"
                onChangeContent={jest.fn()}/>,
            container);
        });

        expect(Quill.prototype.enable).toHaveBeenCalled();

        await act(async () => {
            render(
                <Content
                editArticle={false}
                content="[]"
                onChangeContent={jest.fn()}/>,
            container);
        });

        expect(Quill.prototype.disable).toHaveBeenCalled();
        expect(Quill.prototype.setContents).toHaveBeenCalledTimes(3);
    });
});