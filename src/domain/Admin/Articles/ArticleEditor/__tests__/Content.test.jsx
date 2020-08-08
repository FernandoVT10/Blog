import { render } from "react-dom";
import { act } from "react-dom/test-utils";
import Content from "../Content";
import Quill from "quill";

let container;

const addHandlerMock = jest.fn();

window.hljs = { configure: jest.fn() };

document.getSelection = jest.fn();

jest.mock("quill");

describe("<Content/> component", () => {
    beforeEach(() => {
        Quill.prototype.getModule = jest.fn(() => {
            return {
                addHandler: addHandlerMock
            };
        });

        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        Object.getOwnPropertyNames(Quill.prototype).forEach(name => {
            Quill.prototype[name].mockReset();
        });

        addHandlerMock.mockReset();

        window.hljs.configure.mockReset();

        document.body.removeChild(container);
        container = null;
    });

    it("should initialize quill editor correctly", async () => {
        const contentMock = [{ test: "test" }];

        await act(async () => {
            render(<Content content={JSON.stringify(contentMock)} />, container);
        });

        expect(window.hljs.configure).toBeCalledWith({
            languages: ["javascript"]
        });

        expect(Quill).toBeCalledWith("#content-editor", {
            modules: {
                syntax: true,
                toolbar: [
                    [{ header: [1, 2, false] }],
                    ["bold", "italic", "underline", "link"],
                    ["image", "code-block"],
                    [{ list: "ordered"}, { list: "bullet" }]
                ]
            },
            readOnly: false,
            imageHandler: expect.any(Function),
            theme: "snow"
        });
        expect(Quill.prototype.getModule).toHaveBeenCalledWith("toolbar");
        expect(addHandlerMock).toHaveBeenCalledWith("image", expect.any(Function));
        expect(Quill.prototype.on).toHaveBeenCalledWith("text-change", expect.any(Function));
        expect(Quill.prototype.setContents).toHaveBeenCalledWith(contentMock);
    });

    it("should call onChangeContent", async () => {
        const contentMock = [{ test: "test" }];
        const onChangeContentMock = jest.fn();

        Quill.prototype.getContents = jest.fn(() => ({ ops: contentMock }));

        await act(async () => {
            render(
                <Content
                content=""
                onChangeContent={onChangeContentMock} />,
            container);
        });

        Quill.prototype.on.mock.calls[0][1]();

        expect(Quill.prototype.getContents).toHaveBeenCalled();
        expect(onChangeContentMock).toHaveBeenCalledWith(JSON.stringify(contentMock));
    });
});