import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import EditArticle from "../EditArticle";

import { useRouter } from "next/router";

window.hljs = { configure: jest.fn() };
document.getSelection = () => {};
URL.createObjectURL = () => "testURL.jpg";

const ARTICLE_MOCK = {
    _id: 192,
    title: "Test title",
    cover: "test.jpg",
    content: "[]",
    description: "Test description",
    categories: [
        { name: "Technology" },
        { name: "Landscapes" },
        { name: "Travels" }
    ]
};

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

const iMAGE_FILE_MOCK = new File([], "test.jpg", {
    type: "image/png"
});

let container;

describe("<EditArticle/> component", () => {
    beforeEach(() => {
        fetchMock.doMock();
        fetchMock
        .once(JSON.stringify({
            data: {
                article: ARTICLE_MOCK
            }
        }))
        .once(JSON.stringify({
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

    it("should call the api to get the article correctly", async () => {
        await act(async () => {
            render(<EditArticle articleId="ID"/>, container);
        });
        
        const fetchCall = fetchMock.mock.calls[0];
        
        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/articles/ID/");
    });

    it("should display a 404 not found error", async () => {
        fetchMock.mockReset();
        fetchMock.doMock();
        fetchMock
        .once(JSON.stringify({
            errors: [
                { message: "404" }
            ]
        }))
        .once(JSON.stringify({
            data: {
                categories: CATEGORIES_MOCK
            }
        }));

        await act(async () => {
            render(<EditArticle articleId="ID"/>, container);
        });
        
        expect(container.querySelector(".article-editor__not-found")).not.toBeNull();
    });

    it("should call the api and send the data correctly", async () => {
        const routerPushMock = jest.fn();

        useRouter.mockImplementation(() => ({
            pathname: "/",
            push: routerPushMock
        }));

        await act(async () => {
            render(<EditArticle articleId="ID"/>, container);
        });

        const inputFile = container.querySelector("input[type='file']");
        const titleTextarea = container.querySelector(".article-editor-title");
        const descriptionTextarea = container.querySelector(".article-editor-description");

        act(() => {
            titleTextarea.value = "Test title";
            Simulate.change(titleTextarea);

            descriptionTextarea.value = "Test description";
            Simulate.change(descriptionTextarea);

            Simulate.change(inputFile, { target: { files: [iMAGE_FILE_MOCK] } });
        });

        const button = container.querySelector(".custom-button--save");

        fetchMock.mockOnce(JSON.stringify({ data: null }));

        await act(async () => Simulate.click(button));

        const fetchCall = fetchMock.mock.calls[2];

        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/articles/ID/");
        expect(fetchCall[1].method).toBe("PUT");
        expect(fetchCall[1].headers.Authorization).toBe("Bearer undefined");

        const formData = fetchCall[1].body;

        expect(formData.get("cover")).toBe(iMAGE_FILE_MOCK);
        expect(formData.get("title")).toBe("Test title");
        expect(formData.get("description")).toBe("Test description");
        expect(formData.getAll("categories")).toEqual(
            ["Technology", "Landscapes", "Travels"]
        );

        expect(routerPushMock).toBeCalledWith({
            pathname: "/",
            query: {}
        });
    });

    it("should call the api and send the data correctly without the cover", async () => {
        const routerPushMock = jest.fn();

        useRouter.mockImplementation(() => ({
            pathname: "/",
            push: routerPushMock
        }));

        await act(async () => {
            render(<EditArticle articleId="ID"/>, container);
        });

        const titleTextarea = container.querySelector(".article-editor-title");
        const descriptionTextarea = container.querySelector(".article-editor-description");

        act(() => {
            titleTextarea.value = "Test title";
            Simulate.change(titleTextarea);

            descriptionTextarea.value = "Test description";
            Simulate.change(descriptionTextarea);
        });

        const button = container.querySelector(".custom-button--save");

        fetchMock.mockOnce(JSON.stringify({ data: null }));

        await act(async () => Simulate.click(button));

        const formData = fetchMock.mock.calls[2][1].body;

        expect(formData.get("cover")).toBeNull();
        expect(formData.get("title")).toBe("Test title");
        expect(formData.get("description")).toBe("Test description");
        expect(formData.getAll("categories")).toEqual(
            ["Technology", "Landscapes", "Travels"]
        );

        expect(routerPushMock).toBeCalledWith({
            pathname: "/",
            query: {}
        });
    });

    it("should display an error", async () => {
        await act(async () => {
            render(<EditArticle articleId="ID"/>, container);
        });

        const titleTextarea = container.querySelector(".article-editor-title");
        const descriptionTextarea = container.querySelector(".article-editor-description");

        act(() => {
            titleTextarea.value = "Test title";
            Simulate.change(titleTextarea);

            descriptionTextarea.value = "Test description";
            Simulate.change(descriptionTextarea);
        });

        const button = container.querySelector(".custom-button--save");

        fetchMock.mockOnce(JSON.stringify({
            errors: [
                { message: "This is a test error" }
            ]
        }));

        await act(async () => Simulate.click(button));

        const p = container.querySelector(".formulary__message");

        expect(p.textContent).toBe("This is a test error");
    });


    it("should display a title error", async () => {
        await act(async () => {
            render(<EditArticle articleId="ID"/>, container);
        });
        
        const titleTextarea = container.querySelector(".article-editor-title");

        act(() => {
            titleTextarea.value = "";
            Simulate.change(titleTextarea);
        });

        const button = container.querySelector(".custom-button--save");

        act(() => Simulate.click(button));

        const p = container.querySelector(".formulary__message");

        expect(p.textContent).toBe("The title is required");
    });

    it("should display a description error", async () => {
        await act(async () => {
            render(<EditArticle articleId="ID"/>, container);
        });

        const descriptionTextarea = container.querySelector(".article-editor-description");

        act(() => {
            descriptionTextarea.value = "";
            Simulate.change(descriptionTextarea);
        });

        const button = container.querySelector(".custom-button--save");

        act(() => Simulate.click(button));

        const p = container.querySelector(".formulary__message");

        expect(p.textContent).toBe("The description is required");
    });
});