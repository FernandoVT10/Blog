import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import Title from "../Title";

const onChangeTitle = jest.fn();

let container;

describe("<Title/> component", () => {
    beforeEach(() => {
        onChangeTitle.mockReset();

        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it("It should change the render and the local title when we change the editArticle", () => {
        act(() => {
            render(
                <Title
                editArticle={false}
                onChangeTitle={onChangeTitle}
                title="This is"/>,
            container);
        });

        const h1 = container.querySelector("h1");
        expect(h1.textContent).toBe("This is");

        act(() => {
            render(
                <Title
                editArticle={true}
                onChangeTitle={onChangeTitle}
                title="This is a test"/>,
            container);
        });

        const textarea = container.querySelector("textarea");
        expect(textarea.value).toBe("This is a test");
    });

    it("It should call onChangeTitle", () => {
        act(() => {
            render(
                <Title
                editArticle={true}
                onChangeTitle={onChangeTitle}
                title="This is a test"/>,
            container);
        });

        const textarea = container.querySelector("textarea");

        act(() => {
            textarea.value = "This is not a test";
            Simulate.change(textarea);
        });

        expect(onChangeTitle).toBeCalledWith("This is not a test");
    });
});