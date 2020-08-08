import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import Articles from "../Articles";

import { useRouter } from "next/router";

let container;

describe("<Articles/> component", () => {
    beforeEach(() => {
        fetchMock.doMock();
        fetchMock
        .once(JSON.stringify({
            data: { categories: [] }
        }))
        .once(JSON.stringify({
            data: {
                articles: [],
                pagination: {}
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

    it("should render <ArticlesTable/>", async () => {
        await act(async () => {
            render(<Articles/>, container);
        });

        expect(container.querySelector(".custom-table__not-found")).not.toBeNull();
    });

    it("should render <EditArticle/>", async () => {
        await act(async () => {
            render(<Articles/>, container);
        });

        useRouter.mockImplementation(() => ({
            query: { editArticleId: "ID" }
        }));

        fetchMock
        .once(JSON.stringify({}))
        .once(JSON.stringify({
            data: { categories: [] }
        }));

        await act(async () => {
            render(<Articles/>, container);
        });

        expect(container.querySelector(".article-editor__not-found")).not.toBeNull();
    });

    it("should render <AddArticle/>", async () => {
        useRouter.mockImplementation(() => ({
            query: {}
        }));

        await act(async () => {
            render(<Articles/>, container);
        });

        const button = container.querySelector(".admin-articles-table__add-article-button");

        fetchMock.mockOnce(JSON.stringify({
            data: { categories: [] }
        }));

        act(() => Simulate.click(button));

        expect(container.querySelector(".article-editor")).not.toBeNull();
    });
});