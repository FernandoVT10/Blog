import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import Description from "../Description";
import { text } from "body-parser";

let container;

describe("<Description/> component", () => {
    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it("It should change the render when we change the editArticle", () => {
        render(
            <Description
            editArticle={false}
            onChangeDescription={jest.fn()}
            description="This is a description" />,
        container);

        expect(container.querySelector("textarea")).toBeNull();

        render(
            <Description
            editArticle={true}
            onChangeDescription={jest.fn()}
            description="This is not a description" />,
        container);

        const textarea = container.querySelector("textarea");
        expect(textarea.value).toBe("This is not a description");
    });

    it("It should call onChangeDescription", () => {
        const onChangeDescription = jest.fn();

        render(
            <Description
            editArticle={true}
            onChangeDescription={onChangeDescription}
            description="This is a description" />,
        container);

        const textarea = container.querySelector("textarea");

        act(() => {
            textarea.value = "This is not a description";
            Simulate.change(textarea);
        });

        expect(onChangeDescription).toBeCalledWith("This is not a description");
    });
});