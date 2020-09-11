import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import Category from "../Category";

const CATEGORY_MOCK = {
    _id: "qwerty",
    name: "Landscapes"
}

let container;

describe("Domain Admin Categories <Category/> component", () => {
    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it("should set the category correctly", () => {
        render(
            <Category
            category={CATEGORY_MOCK}
            updateCategoryName={() => {}}
            deleteCategory={() => {}}/>
        , container);

        const div = container.querySelector(".admin-categories-category__badge");

        expect(div.textContent).toBe("Landscapes");
    });

    it("should activate and desactivate the edit mode", () => {
        render(
            <Category
            category={CATEGORY_MOCK}
            updateCategoryName={() => {}}
            deleteCategory={() => {}}/>
        , container);

        const categoryBadge = container.querySelector(".admin-categories-category__badge");
        act(() => Simulate.click(categoryBadge));

        const input = container.querySelector("input");
        expect(input.value).toBe("Landscapes");

        expect(container.querySelector("form")).not.toBeNull();
        
        act(() => Simulate.blur(input));

        expect(container.querySelector("form")).toBeNull();
    });

    it("should call updateCategoryName", () => {
        const updateCategoryNameMock = jest.fn();

        render(
            <Category
            category={CATEGORY_MOCK}
            updateCategoryName={updateCategoryNameMock}
            deleteCategory={() => {}}/>
        , container);

        const categoryBadge = container.querySelector(".admin-categories-category__badge");
        act(() => Simulate.click(categoryBadge));

        const input = container.querySelector("input");
        act(() => {
            input.value = "Tutorials";
            Simulate.change(input);
        });

        const form = container.querySelector("form");
        act(() => Simulate.submit(form));

        expect(updateCategoryNameMock).toBeCalledWith("qwerty", "Tutorials");
    });

    it("should call deleteCategory", () => {
        const deleteCategoryMock = jest.fn();

        render(
            <Category
            category={CATEGORY_MOCK}
            updateCategoryName={() => {}}
            deleteCategory={deleteCategoryMock}/>
        , container);

        const deleteButton = container.querySelector("button");

        act(() => Simulate.click(deleteButton));

        expect(deleteCategoryMock).toBeCalledWith("qwerty");
    });
});