import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import ImageEditor from "../ImageEditor";

let container;

describe("<ImageEditor/> component", () => {
    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it("should set initial image", async () => {
        act(() => {
            render(<ImageEditor image="test.jpg" />, container);
        });

        const div = container.querySelector("div");

        expect(div.style.background).toBe("url(test.jpg)");
    });

    it("shouldn't set initial image", async () => {
        act(() => {
            render(<ImageEditor image="" />, container);
        });

        const div = container.querySelector("div");

        expect(div.style.background).toBe("url()");
    });

    it("should change the image", async () => {
        const onChangeImageMock = jest.fn();
        const fileMock = new File([], "test.jpg", {
            type: "image/png"
        });

        act(() => {
            render(<ImageEditor image="test.jpg" onChangeImage={onChangeImageMock} />, container);
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