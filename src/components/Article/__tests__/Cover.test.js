import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import Cover from "../Cover";

const IMAGE_MOCK = new File([], "test.jpg", {
    type: "image/png"
});

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

    it("It should change the render when we change the editArticle", () => {
        act(() => {
            render(
                <Cover
                editArticle={false}
                onChangeImage={jest.fn()}
                cover="test-image.jpg"/>,
            container);
        });

        let divStyles = container.querySelector("div").style._values;

        expect(container.querySelector("input")).toBeNull();
        expect(divStyles.background).toBe("url(/img/articles/test-image.jpg)");

        act(() => {
            render(
                <Cover
                editArticle={true}
                onChangeImage={jest.fn()}
                cover="test-image2.jpg"/>,
            container);
        });

        divStyles = container.querySelector("div").style._values;

        expect(container.querySelector("input")).not.toBeNull();
        expect(divStyles.background).toBe("url(/img/articles/test-image2.jpg)");
    });

    it("It should change the image and call onChangeImage", () => {
        const onChangeImage = jest.fn();

        act(() => {
            render(
                <Cover
                editArticle={true}
                onChangeImage={onChangeImage}
                cover="test-image.jpg"/>,
            container);
        });

        const input = container.querySelector("input");
        const createObjectURL = jest.fn(() => "testURL.jpg");
        act(() => {
            URL.createObjectURL = createObjectURL;

            Simulate.change(input, { target: { files: [IMAGE_MOCK] } });
        });

        const divStyles = container.querySelector("div").style._values;

        expect(divStyles.background).toBe("url(testURL.jpg)");
        expect(createObjectURL).toHaveBeenCalledWith(IMAGE_MOCK);
        expect(onChangeImage).toHaveBeenCalledWith(IMAGE_MOCK);
    });
});