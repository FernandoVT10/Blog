import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import { useRouter } from "next/router";
import ArticleCardList from "../ArticleCardList";

const PAGIANATION_MOCK = {
    hasPrevPage: true,
    prevPage: 5,
    hasNextPage: true,
    nextPage: 7,
    pages: [
        { number: 2, active: false },
        { number: 3, active: false },
        { number: 4, active: false },
        { number: 5, active: false },
        { number: 6, active: true },
        { number: 7, active: false },
        { number: 8, active: false }
    ]
};

Object.defineProperty(window, "location", {
    value: {
        search: ""
    }
});

let container;

describe("<ArticleCardList/> component", () => {
    beforeEach(() => {
        fetchMock.doMock();
        fetchMock
            .once(JSON.stringify([]))
            .once(JSON.stringify({
                articles: [],
                pagination: PAGIANATION_MOCK
            }));

        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        window.location.search = "";
        fetchMock.mockReset();

        document.body.removeChild(container);
        container = null;
    });

    it("It should call the api correctly", async () => {
        window.location.search = "?test=true";

        await act(async () => {
            render(<ArticleCardList/>, container);
        });

        const fetchCall = fetchMock.mock.calls[1];

        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/articles/getFilteredArticles?test=true");
    });

    it("It should call the api when we change the router.query", async () => {
        window.location.search = "?test=true";

        await act(async () => {
            render(<ArticleCardList/>, container);
        });

        let fetchCall = fetchMock.mock.calls[1];
        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/articles/getFilteredArticles?test=true");

        fetchMock.mockClear();
        fetchMock.mockOnce(JSON.stringify({
            articles: [],
            pagination: PAGIANATION_MOCK
        }));

        useRouter.mockImplementation(() => ({
            query: { search: "Test value" }
        }));

        window.location.search = "?test=false";

        await act(async () => {
            render(<ArticleCardList/>, container);
        });

        fetchCall = fetchMock.mock.calls[0];
        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/articles/getFilteredArticles?test=false");
    });

    it("It shouldn't call the api when we change the router.query", async () => {
        window.location.search = "?test=true";

        await act(async () => {
            render(<ArticleCardList/>, container);
        });

        fetchMock.mockClear();
        fetchMock.mockOnce(JSON.stringify({
            articles: [],
            pagination: PAGIANATION_MOCK
        }));

        useRouter.mockImplementation(() => ({
            query: { search: "Test value" }
        }));

        await act(async () => {
            render(<ArticleCardList/>, container);
        });

        expect(fetchMock).not.toHaveBeenCalled();
    });
});