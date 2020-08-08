import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import ArticlesTable from "../ArticlesTable";

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

const ARTICLES_MOCK = [
    {
        _id: 1,
        cover: "image-1.jpg",
        title: "Test title",
        description: "Test description",
        categories: [
            {
                _id: 6,
                name: "Landscapes"
            },
            {
                _id: 19,
                name: "Travels"
            }
        ]
    },
    {
        _id: 2,
        cover: "image-2.jpg",
        title: "Test title",
        description: "Test description",
        categories: [
            {
                _id: 2,
                name: "Technology"
            }
        ]
    }
];

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

describe("<ArticlesTable/> component", () => {
    beforeEach(() => {
        fetchMock.doMock();
        fetchMock
        .once(JSON.stringify({
            data: {
                categories: CATEGORIES_MOCK
            }
        }))
        .once(JSON.stringify({
            data: {
                articles: ARTICLES_MOCK,
                pagination: PAGIANATION_MOCK
            }
        }));

        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        fetchMock.mockReset();
        window.location.search = "";

        document.body.removeChild(container);
        container = null;
    });

    it("should call the api correctly", async () => {
        window.location.search = "?testparameter=test";

        await act(async () => {
            render(<ArticlesTable setAddArticle={() => {}}/>, container);
        });

        const fetchCall = fetchMock.mock.calls[1];

        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/articles?testparameter=test");
    });

    it("should delete an article correctly", async () => {
        const routerPushMock = jest.fn();

        useRouter.mockImplementation(() => ({
            query: { page: 5 },
            pathname: "/",
            push: routerPushMock
        }));

        await act(async () => {
            render(<ArticlesTable setAddArticle={() => {}}/>, container);
        });

        const button = container.querySelector(".confirm-modal__button--yes");

        fetchMock.mockOnce(JSON.stringify({ data: null }));

        await act(async () => Simulate.click(button));

        const fetchCall = fetchMock.mock.calls[2];

        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/articles/1");
        expect(fetchCall[1].method).toBe("DELETE");
        expect(fetchCall[1].headers).toEqual({
            Authorization: "Bearer undefined",
            "Content-Type": "application/json",
        });

        expect(routerPushMock).toBeCalledWith({
            pathname: "/",
            query: { page: 5 }
        });
    });

    it("should call router.push with the previous page", async () => {
        const routerPushMock = jest.fn();

        useRouter.mockImplementation(() => ({
            query: { page: 5 },
            pathname: "/",
            push: routerPushMock
        }));

        fetchMock.mockReset();
        fetchMock.doMock();
        fetchMock
        .once(JSON.stringify({
            data: {
                categories: CATEGORIES_MOCK
            }
        }))
        .once(JSON.stringify({
            data: {
                articles: [ARTICLES_MOCK[0]],
                pagination: PAGIANATION_MOCK
            }
        }));

        await act(async () => {
            render(<ArticlesTable setAddArticle={() => {}}/>, container);
        });

        const button = container.querySelector(".confirm-modal__button--yes");

        fetchMock.mockOnce(JSON.stringify({ data: null }));

        await act(async () => Simulate.click(button));

        expect(routerPushMock).toBeCalledWith({
            pathname: "/",
            query: { page: 4 }
        });
    });
});