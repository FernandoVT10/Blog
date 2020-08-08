import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import Description from "../Description";

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

    it("should call onChangeDescription", async () => {
        const onChangeDescriptionMock = jest.fn();

        render(
            <Description
            description=""
            onChangeDescription={onChangeDescriptionMock}/>, container
        );
        
        const textarea = container.querySelector("textarea");
        
        act(() => {
            textarea.value = "Test description";
            Simulate.change(textarea);
        });

        expect(onChangeDescriptionMock).toBeCalledWith("Test description");
    });
});