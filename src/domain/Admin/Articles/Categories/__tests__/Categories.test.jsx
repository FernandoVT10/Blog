import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import Categories from "../Categories";

const CATEGORIES_MOCK = [
    {
        _id: 5,
        name: "Landscapes"
    },
    {
        _id: 6,
        name: "Technology"
    },
    {
        _id: 7,
        name: "Tutorials"
    }
];

jest.mock("../Category", () => {
    return ({ category, deleteCategory, updateCategoryName }) => {
        return (
            <div>
                <span className="test-category-name">
                    { category.name }
                </span>

                <button
                className="test-delete-category-button"
                onClick={() => deleteCategory(category._id)}></button>

                <button
                className="test-update-category-button"
                onClick={() => updateCategoryName(category._id, category.name)}></button>
            </div>
        );
    };
});

jest.mock("../AddCategory", () => {
    return ({ addCategory }) => {
        return (
            <button
            className="test-add-category"
            onClick={() => addCategory("new category")}></button>
        );
    };
});

let container;

describe("Domain Admin <Categories/> component", () => {
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

    it("should call the api and set the data correctly", async () => {
        await act(async () => {
            render(<Categories/>, container);
        });

        const categories = container.querySelectorAll(".test-category-name");
        expect(categories.length).toBe(3);

        categories.forEach((category, index) => {
            expect(category.textContent).toBe(CATEGORIES_MOCK[index].name);
        });

        const fetchCall = fetchMock.mock.calls[0];
        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/categories");
    });

    it("should add a category", async () => {
        await act(async () => {
            render(<Categories/>, container);
        });

        fetchMock.mockOnce(JSON.stringify({
            data: {
                createdCategory: {
                    _id: 8,
                    name: "new category"
                }
            }
        }));

        const addCategoryButton = container.querySelector(".test-add-category");
        await act(async () => Simulate.click(addCategoryButton));

        const fetchCall = fetchMock.mock.calls[1];

        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/categories");
        expect(fetchCall[1].method).toBe("POST");
        expect(fetchCall[1].body).toBe(JSON.stringify({
            name: "new category"
        }));

        const categories = container.querySelectorAll(".test-category-name");
        expect(categories.length).toBe(4);
        expect(categories[3].textContent).toBe("new category");
    });

    it("should update a category", async () => {
        await act(async () => {
            render(<Categories/>, container);
        });

        fetchMock.mockOnce(JSON.stringify({
            data: {
                updatedCategory: {
                    _id: 6,
                    name: "updated category"
                }
            }
        }));

        const updateButtons = container.querySelectorAll(".test-update-category-button");
        await act(async () => Simulate.click(updateButtons[1]));

        const fetchCall = fetchMock.mock.calls[1];

        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/categories/6");
        expect(fetchCall[1].method).toBe("PUT");
        expect(fetchCall[1].body).toBe(JSON.stringify({
            name: "Technology"
        }));

        const categories = container.querySelectorAll(".test-category-name");
        expect(categories[1].textContent).toBe("updated category");
    });

    it("should remove a category", async () => {
        await act(async () => {
            render(<Categories/>, container);
        });

        fetchMock.mockOnce(JSON.stringify({}));

        const deleteButtons = container.querySelectorAll(".test-delete-category-button");
        await act(async () => Simulate.click(deleteButtons[1]));

        const fetchCall = fetchMock.mock.calls[1];

        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/categories/6");
        expect(fetchCall[1].method).toBe("DELETE");

        const categories = container.querySelectorAll(".test-category-name");
        expect(categories.length).toBe(2);
    });
});