import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import Article from "../Article";
import { useRouter } from "next/router";

const ARTICLE_MOCK = {
    title: "test title",
    cover: "test.jpg",
    content: "[]",
    categories: []
};

jest.mock("quill");

let container;

describe("<Article/> component", () => {
    beforeEach(() => {
        fetchMock.doMock();

        fetchMock.mockOnce(JSON.stringify({
            data: {
                article: ARTICLE_MOCK
            }
        }));

        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;

        fetchMock.mockReset();
    });

    it("It should call the api correctly", async () => {
        useRouter.mockImplementation(() => ({
            query: { articleId: "test_id" }
        }));

        await act(async () => {
            render(<Article/>, container);
        });

        const fetchCall = fetchMock.mock.calls[0];

        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/articles/test_id");
    });

    it("It should display a 404 error", async () => {
        useRouter.mockImplementation(() => ({
            query: { articleId: "test_id" }
        }));

        fetchMock.mockReset();
        fetchMock.doMock();
        fetchMock.mockOnce(JSON.stringify({}));

        await act(async () => {
            render(<Article/>, container);
        });

        const span = container.querySelector("span");

        expect(span.textContent).toBe("404");
    });
});