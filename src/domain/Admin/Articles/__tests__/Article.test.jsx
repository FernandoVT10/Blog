import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import Articles from "../Articles";

import { useRouter } from "next/router";

let container;

jest.mock("../Categories", () => {
    return () => {
        return (
            <div className="categories"></div>
        );
    }
});

jest.mock("../ArticlesTable", () => {
    return ({ setAddArticle }) => {
        return (
            <div className="articles-table">
                <button
                className="test-set-add-article"
                onClick={() => setAddArticle(true)}></button>
            </div>
        );
    }
});

jest.mock("../ArticleEditor/EditArticle", () => {
    return () => {
        return (
            <div className="edit-article"></div>
        );
    }
});

jest.mock("../ArticleEditor/AddArticle", () => {
    return () => {
        return (
            <div className="add-article"></div>
        );
    }
});

describe("<Articles/> component", () => {
    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it("should render <ArticlesTable/> and <Categories/>", () => {
        act(() => {
            render(<Articles/>, container);
        });

        expect(container.querySelector(".categories")).not.toBeNull();
        expect(container.querySelector(".articles-table")).not.toBeNull();
    });

    it("should render <EditArticle/>", () => {
        act(() => {
            render(<Articles/>, container);
        });

        expect(container.querySelector(".edit-article")).toBeNull();

        useRouter.mockImplementation(() => ({
            query: { editArticleId: "ID" }
        }));

        act(() => {
            render(<Articles/>, container);
        });

        expect(container.querySelector(".edit-article")).not.toBeNull();
    });

    it("should render <AddArticle/>", () => {
        useRouter.mockImplementation(() => ({
            query: {}
        }));

        act(() => {
            render(<Articles/>, container);
        });

        expect(container.querySelector(".article-editor")).toBeNull();

        const button = container.querySelector(".test-set-add-article");

        act(() => Simulate.click(button));

        expect(container.querySelector(".add-article")).not.toBeNull();
    });
});