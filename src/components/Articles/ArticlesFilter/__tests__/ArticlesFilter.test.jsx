import { act, Simulate } from "react-dom/test-utils";
import { render } from "react-dom";
import ArticlesFilter from "../ArticlesFilter";
import { useRouter } from "next/router";

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

Object.defineProperty(window, "location", {
    value: {
        search: "?"
    }
});

let container;

describe("<ArticleFilter/> Component", () => {
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
        document.body.removeChild(container);
        container = null;

        fetchMock.mockReset();
        window.location.search = "";
    });

    it("It should call the api correctly", async () => {
        await act(async () => {
            render(<ArticlesFilter/>, container);
        });

        const fetchCall = fetchMock.mock.calls[0];

        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/categories");
    });

    it("It should change the search inputs value with query search value", async () => {
        useRouter.mockImplementation(() => ({
            query: { search: "Test value" }
        }));

        await act(async () => {
            render(<ArticlesFilter/>, container);
        });

        const inputsSearch = container.querySelectorAll(".formulary__input");

        inputsSearch.forEach(({ value }) => {
            expect(value).toBe("Test value")
        });
    });

    it("It should call router.push", async () => {
        window.location.search = "?categories=Technology";

        const routerPush = jest.fn();

        useRouter.mockImplementation(() => ({
            query: { search: "Test value" },
            pathname: "/",
            push: routerPush
        }));

        await act(async () => {
            render(<ArticlesFilter/>, container);
        });

        const form = container.querySelector("form");

        act(() => {
            Simulate.submit(form);
        });

        expect(routerPush).toHaveBeenCalledWith({
            pathname: "/",
            query: {
                categories: ["Technology"],
                search: "Test value"
            }
        });
    });

    it("It should call active and a category", async () => {
        const routerPush = jest.fn();

        useRouter.mockImplementation(() => ({
            query: {},
            pathname: "/",
            push: routerPush
        }));

        await act(async () => {
            render(<ArticlesFilter/>, container);
        });

        const category = container.querySelector("#category-Landscapes");

        act(() => Simulate.change(category));

        const form = container.querySelector("form");

        act(() => {
            Simulate.submit(form);
        });

        expect(routerPush).toHaveBeenCalledWith({
            pathname: "/",
            query: {
                categories: ["Landscapes"]
            }
        });
    });

    it("It should active and desactive the filter", async () => {
        await act(async () => {
            render(<ArticlesFilter/>, container);
        });

        const button = container.querySelector(".articles-filter__filter-button");
        const filter = container.querySelector(".articles-filter__filter");

        act(() => {
            Simulate.click(button);
        });

        expect(filter.classList.contains("articles-filter__filter--active")).toBeTruthy();
        expect(button.classList.contains("articles-filter__filter-button--active")).toBeTruthy();

        act(() => {
            Simulate.click(button);
        });

        expect(filter.classList.contains("articles-filter__filter--active")).toBeFalsy();
        expect(button.classList.contains("articles-filter__filter-button--active")).toBeFalsy();
    });
});