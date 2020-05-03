import { act, Simulate } from "react-dom/test-utils";
import { render } from "react-dom";
import ArticlesFilter from "../ArticleFilter/";
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

jest.mock("next/router", () => ({
    useRouter: jest.fn(() => ({ query: {} })),
}));

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
    it('Check if renders correctly', async () => {
        await act(async () => {
            render(<ArticlesFilter/>, container);
        });

        expect(container).toMatchSnapshot();
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
    })
});