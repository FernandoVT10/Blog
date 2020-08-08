import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import Categories from "../Categories";

const CATEGORIES_MOCK = [
    {
        _id: 2,
        name: "Technology"
    },
    {
        _id: 6,
        name: "Landscapes"
    },
    {
        _id: 19,
        name: "Travels"
    }
];

let container;

describe("<Categories/> component", () => {
    beforeEach(() => {
        fetchMock.doMock();
        fetchMock.mockOnce(JSON.stringify({
            data: {
                categories: CATEGORIES_MOCK
            }
        }));

        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        fetchMock.mockReset();

        document.body.removeChild(container);
        container = null;
    });

    it("should call api and set the data correctly", async () => {
        await act(async () => {
            render(
                <Categories 
                categories={[]}
                onChangeCategories={() => {}}/>,
            container);
        });

        const fetchCall = fetchMock.mock.calls[0];
        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/categories");

        const categoriesContainer = container.querySelector(".article-editor-categories__add-category");
        expect(categoriesContainer.children.length).toBe(3);
    });

    it("should change the categories when we change the categories prop", async () => {
        await act(async () => {
            render(
                <Categories 
                categories={["Landscapes", "Technology", "Travels"]}
                onChangeCategories={() => {}}/>,
            container);
        });

        let categories = container.querySelectorAll(".article-editor-categories__category");
        expect(categories.length).toBe(3);

        act(() => {
            render(
                <Categories 
                categories={["Landscapes"]}
                onChangeCategories={() => {}}/>,
            container);
        });

        categories = container.querySelectorAll(".article-editor-categories__category");
        expect(categories.length).toBe(1);
    });

    it("should activate or desactivate the Add Category Menu", async () => {
        await act(async () => {
            render(
                <Categories 
                categories={[]}
                onChangeCategories={() => {}}/>,
            container);
        });

        const button = container.querySelector("button");
        const addCategory = container.querySelector(".article-editor-categories__add-category");

        expect(
            addCategory
            .classList
            .contains("article-editor-categories__add-category--active")
        ).toBeFalsy();

        act(() => {
            Simulate.click(button);
        });

        expect(
            addCategory
            .classList
            .contains("article-editor-categories__add-category--active")
        ).toBeTruthy();
    });

    it("should activate and desactivate a category", async () => {
        const onChangeCategoriesMock = jest.fn();
        await act(async () => {
            render(
                <Categories 
                categories={[]}
                onChangeCategories={onChangeCategoriesMock}/>,
            container);
        });

        const categoryCheckbox = container.querySelector("#category-Travels");
        expect(categoryCheckbox.checked).toBeFalsy();

        act(() => {
            Simulate.change(categoryCheckbox);
        });

        expect(categoryCheckbox).toBeTruthy();
        expect(onChangeCategoriesMock).toBeCalledWith(["Travels"]);

        act(() => {
            render(
                <Categories 
                categories={["Travels"]}
                onChangeCategories={onChangeCategoriesMock}/>,
            container);
        });

        onChangeCategoriesMock.mockReset();

        act(() => {
            Simulate.change(categoryCheckbox);
        });

        expect(categoryCheckbox.checked).toBeFalsy();
        expect(onChangeCategoriesMock).toBeCalledWith([]);
    });
});