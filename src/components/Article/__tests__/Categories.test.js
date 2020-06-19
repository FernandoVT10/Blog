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
        fetchMock.mockOnce(JSON.stringify(CATEGORIES_MOCK));

        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it("It should change the render when we change the editArticle", async () => {
        await act(async () => {
            render(
                <Categories 
                editArticle={false}
                categories={CATEGORIES_MOCK}
                onChangeCategories={jest.fn()}/>,
            container);
        });

        expect(container.querySelector(".article__categories__add-category")).toBeNull();

        await act(async () => {
            render(
                <Categories 
                editArticle={true}
                categories={CATEGORIES_MOCK}
                onChangeCategories={jest.fn()}/>,
            container);
        });

        expect(container.querySelector(".article__categories__add-category")).not.toBeNull();
    });

    it("It should change the categories when we change the categories prop", async () => {
        await act(async () => {
            render(
                <Categories 
                editArticle={false}
                categories={CATEGORIES_MOCK}
                onChangeCategories={jest.fn()}/>,
            container);
        });

        expect(container.querySelectorAll(".article__category").length).toBe(3);

        const categories = [CATEGORIES_MOCK[0], CATEGORIES_MOCK[1]];

        await act(async () => {
            render(
                <Categories 
                editArticle={false}
                categories={categories}
                onChangeCategories={jest.fn()}/>,
            container);
        });

        expect(container.querySelectorAll(".article__category").length).toBe(2);
    });

    it("It should activate or desactivate the Add Category Menu", async () => {
        await act(async () => {
            render(
                <Categories 
                editArticle={true}
                categories={CATEGORIES_MOCK}
                onChangeCategories={jest.fn()}/>,
            container);
        });

        const button = container.querySelector("button");
        const addCategory = container.querySelector(".article__categories__add-category");

        expect(
            addCategory
            .classList
            .contains("article__categories__add-category--active")
        ).toBeFalsy();

        act(() => {
            Simulate.click(button);
        });

        expect(
            addCategory
            .classList
            .contains("article__categories__add-category--active")
        ).toBeTruthy();
    });

    it("It should activate and desactivate a category", async () => {
        await act(async () => {
            render(
                <Categories 
                editArticle={true}
                categories={[]}
                onChangeCategories={jest.fn()}/>,
            container);
        });

        const categoryCheckbox = container.querySelector("#category-Travels");
        expect(categoryCheckbox.checked).toBeFalsy();
        expect(container.querySelectorAll(".article__category").length).toBe(0);

        act(() => {
            Simulate.change(categoryCheckbox);
        });

        expect(categoryCheckbox).toBeTruthy();
        expect(container.querySelectorAll(".article__category").length).toBe(1);

        act(() => {
            Simulate.change(categoryCheckbox);
        });

        expect(categoryCheckbox.checked).toBeFalsy();
        expect(container.querySelectorAll(".article__category").length).toBe(0);
    });

    it("It should call onChangeCategories when we activate or desactivate a category", async () => {
        const onChangeCategories = jest.fn();
        
        await act(async () => {
            render(
                <Categories 
                editArticle={true}
                categories={CATEGORIES_MOCK}
                onChangeCategories={onChangeCategories}/>,
            container);
        });

        const categoryCheckbox = container.querySelector("#category-Travels");

        act(() => {
            Simulate.change(categoryCheckbox);
        });

        expect(onChangeCategories).toHaveBeenCalledWith(["Technology", "Landscapes"]);

        act(() => {
            Simulate.change(categoryCheckbox);
        });

        expect(onChangeCategories).toBeCalledTimes(2);
        expect(onChangeCategories).toHaveBeenCalledWith([
            "Technology", "Landscapes", "Travels"
        ]);
    });
});