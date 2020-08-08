import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import Cover from "../Cover";

let container;

describe("<Cover/> component", () => {
    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it("should set initial cover", async () => {
        act(() => {
            render(<Cover cover="test.jpg" />, container);
        });

        const div = container.querySelector("div");

        expect(div.style.background).toBe("url(/img/articles/test.jpg)");
    });

    it("shouldn't set initial cover", async () => {
        act(() => {
            render(<Cover cover="" />, container);
        });

        const div = container.querySelector("div");

        expect(div.style.background).toBe("url()");
    });

    it("should change the cover", async () => {
        const onChangeImageMock = jest.fn();
        const fileMock = new File([], "test.jpg", {
            type: "image/png"
        });

        act(() => {
            render(<Cover cover="test.jpg" onChangeImage={onChangeImageMock} />, container);
        });

        const input = container.querySelector("input");

        act(() => {
            URL.createObjectURL = () => "testURL.jpg";

            Simulate.change(input, { target: { files: [fileMock] } });
        });

        const div = container.querySelector("div");

        expect(div.style.background).toBe("url(testURL.jpg)");
        expect(onChangeImageMock).toHaveBeenCalledWith(fileMock);
    });
});