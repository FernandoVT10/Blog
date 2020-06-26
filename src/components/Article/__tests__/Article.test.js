import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import Article from "../Article";
import Quill from "quill";
import { useRouter } from "next/router";

const ARTICLE_MOCK = {
    _id: 192,
    title: "Test title",
    content: "[]",
    description: "Test description",
    categories: [
        { name: "Technology" },
        { name: "Lanscapes" },
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

const IMAGE_MOCK = new File([], "test.jpg", {
    type: "image/png"
});

jest.mock("quill");

window.hljs = {
    configure: jest.fn()
};

document.getSelection = jest.fn();

document.querySelector = () => ({
    classList: {
        add: () => {},
        remove: () => {}
    }
});

let container;

describe("<Article/> component", () => {
    beforeEach(() => {
        Quill.prototype.getModule = () => ({
            addHandler: jest.fn()
        });
 
        fetchMock.doMock();
        fetchMock
            .once(JSON.stringify(CATEGORIES_MOCK))
            .once(JSON.stringify({ verifyToken: true }));

        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it("It should change the editArticle and the float buttons", async () => {
        await act(async () => {
            render(<Article article={ARTICLE_MOCK}/>, container);
        });

        const floatButton = container.querySelector(".article__float-button");

        expect(container.querySelector(".article__float-button--cancel")).toBeNull();
        act(() => Simulate.click(floatButton));

        const cancelButton = container.querySelector(".article__float-button--cancel");

        act(() => Simulate.click(cancelButton));
        expect(container.querySelector(".article__float-button--cancel")).toBeNull();
    });

    it("It should set editArticle to true when the query parameter 'editArticle' is true", async () => {
        useRouter.mockImplementation(() => ({
            query: { editArticle: "true" }
        }));

        await act(async () => {
            render(<Article article={ARTICLE_MOCK}/>, container);
        });

        expect(container.querySelector(".article__float-button--cancel")).not.toBeNull();
    });

    it("It should send the data to the api", async () => {
        await act(async () => {
            render(<Article article={ARTICLE_MOCK}/>, container);
        });

        const floatButton = container.querySelector(".article__float-button");
        act(() => Simulate.click(floatButton));

        fetchMock.mockClear();

        act(() => {
            const titleTextarea = container.querySelector(".article__edit-title");
            const descriptionTextarea = container.querySelector(".article__description");
            const coverInput = container.querySelector(".article__cover__input");
            const categoryCheckbox = container.querySelector("#category-Travels");

            URL.createObjectURL = jest.fn();

            titleTextarea.value = "The best title";
            Simulate.change(titleTextarea);

            descriptionTextarea.value = "The best description";
            Simulate.change(descriptionTextarea);

            Simulate.change(coverInput, { target: { files: [IMAGE_MOCK] } });

            Simulate.change(categoryCheckbox);
        });

        const saveButton = container.querySelector(".article__float-button");

        await act(async () => {
            Simulate.click(saveButton);
        });

        const fetchCall = fetchMock.mock.calls[0];
        const fetchBody = fetchCall[1].body;

        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/articles/updateArticle/");

        expect(fetchBody.get("articleId")).toBe("192");
        expect(fetchBody.get("title")).toBe("The best title");
        expect(fetchBody.get("content")).toBe("[]");
        expect(fetchBody.get("description")).toBe("The best description");
        expect(fetchBody.get("cover")).toEqual(IMAGE_MOCK);
        expect(fetchBody.getAll("categories")).toEqual([
            "Technology", "Lanscapes"
        ]);
    });
});