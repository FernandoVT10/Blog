import { act, Simulate } from "react-dom/test-utils";
import { render } from "react-dom";
import ArticlesFilter from "../ArticlesFilter/";
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

let container;

describe('<ArticleFilter/> Component', () => {
    beforeEach(() => {
        fetchMock.doMock();

        fetchMock.mockOnce(JSON.stringify(
            CATEGORIES_MOCK
        ));

        container = document.createElement('div');
        document.body.appendChild(container);
    });
    
    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it('It should active and desactive category', async () => {
        await act(async () => {
            render(<ArticlesFilter/>, container);
        });

        const checkbox = container.querySelector("#category-Technology");

        act(() => {
            Simulate.change(checkbox);
        });

        expect(checkbox.checked).toBeTruthy();

        act(() => {
            Simulate.change(checkbox);
        });
        expect(checkbox.checked).toBeFalsy();
    });

    it('It should change the search inputs value with query search value', async () => {
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

    it('It should render the categories with an active', async () => {
        Object.defineProperty(window, 'location', {
            value: {
                search: "?categories=Landscapes"
            }
        });

        await act(async () => {
            render(<ArticlesFilter/>, container);
        });
        
        const category = container.querySelector("#category-Landscapes");

        expect(category.checked).toBeTruthy();
    });

    it('It should call router.push', async () => {
        Object.defineProperty(window, 'location', {
            value: {
                search: "?categories=Technology"
            }
        });

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
                categories: ["Landscapes"],
                search: "Test value"
            }
        });
    });

    it('It should active and desactive the filter', async () => {
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