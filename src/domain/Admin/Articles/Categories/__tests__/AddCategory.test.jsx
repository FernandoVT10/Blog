import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import AddCategory from "../AddCategory";

let container;

describe("Domain Admin Categories <AddCategory/> component", () => {
    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it("should desactivate and activate the edit mode", () => {
        render(<AddCategory addCategory={() => {}}/>, container);

        const button = container.querySelector("button");
        act(() => Simulate.click(button));

        expect(container.querySelector("form")).not.toBeNull();

        const input = container.querySelector("input");
        act(() => Simulate.blur(input));

        expect(container.querySelector("form")).toBeNull();
    });

    it("should call addCategory", () => {
        const addCategoryMock = jest.fn();

        render(<AddCategory addCategory={addCategoryMock}/>, container);

        const button = container.querySelector("button");
        act(() => Simulate.click(button));

        const input = container.querySelector("input");
        act(() => {
            input.value = "Technology";
            Simulate.change(input);
        });

        const form = container.querySelector("form");
        act(() => Simulate.submit(form));

        expect(addCategoryMock).toBeCalledWith("Technology");
    });
});