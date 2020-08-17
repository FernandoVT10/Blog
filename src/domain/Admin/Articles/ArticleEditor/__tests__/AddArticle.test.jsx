import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import AddArticle from "../AddArticle";

window.hljs = { configure: jest.fn() };
document.getSelection = () => {};
URL.createObjectURL = () => "testURL.jpg";

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

describe("<AddArticle/> component", () => {
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
        fetchMock.mockReset();

        document.body.removeChild(container);
        container = null;
    });

    it("should call the api and send the data correctly", async () => {
        const setAddArticleMock = jest.fn();

        await act(async () => {
            render(<AddArticle setAddArticle={setAddArticleMock}/>, container);
        });

        const inputFile = container.querySelector("input[type='file']");
        const titleTextarea = container.querySelector(".article-editor-title");
        const descriptionTextarea = container.querySelector(".article-editor-description");
        const categoryCheckbox = container.querySelector("#category-Travels");

        act(() => {
            titleTextarea.value = "Test title";
            Simulate.change(titleTextarea);

            descriptionTextarea.value = "Test description";
            Simulate.change(descriptionTextarea);

            Simulate.change(inputFile, { target: { files: [iMAGE_FILE_MOCK] } });
            Simulate.change(categoryCheckbox);
        });

        const button = container.querySelector(".custom-button--save");

        fetchMock.mockOnce(JSON.stringify({ data: null }));

        await act(async () => Simulate.click(button));

        const fetchCall = fetchMock.mock.calls[1];

        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/articles");
        expect(fetchCall[1].method).toBe("POST");
        expect(fetchCall[1].headers.Authorization).toBe("Bearer undefined");

        const formData = fetchCall[1].body;

        expect(formData.get("cover")).toBe(iMAGE_FILE_MOCK);
        expect(formData.get("title")).toBe("Test title");
        expect(formData.get("description")).toBe("Test description");
        expect(formData.getAll("categories")).toEqual(["Travels"]);


        expect(setAddArticleMock).toBeCalledWith(false);
    });

    it("should display an error", async () => {
        await act(async () => {
            render(<AddArticle setAddArticle={() => {}}/>, container);
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

        fetchMock.mockOnce(JSON.stringify({
            errors: [
                { message: "This is a test error" }
            ]
        }));

        await act(async () => Simulate.click(button));

        const p = container.querySelector(".formulary__message");

        expect(p.textContent).toBe("This is a test error");
    });

    it("should display a cover error", async () => {
        await act(async () => {
            render(<AddArticle/>, container);
        });

        const button = container.querySelector(".custom-button--save");

        act(() => Simulate.click(button));

        const p = container.querySelector(".formulary__message");

        expect(p.textContent).toBe("The cover is required");
    });

    it("should display a title error", async () => {
        await act(async () => {
            render(<AddArticle/>, container);
        });

        const inputFile = container.querySelector("input[type='file']");

        act(() => Simulate.change(inputFile, { target: { files: [iMAGE_FILE_MOCK] } }));

        const button = container.querySelector(".custom-button--save");

        act(() => Simulate.click(button));

        const p = container.querySelector(".formulary__message");

        expect(p.textContent).toBe("The title is required");
    });

    it("should display a description error", async () => {
        await act(async () => {
            render(<AddArticle/>, container);
        });

        const inputFile = container.querySelector("input[type='file']");
        const titleTextarea = container.querySelector(".article-editor-title");

        act(() => {
            titleTextarea.value = "Test title";
            Simulate.change(titleTextarea);
            Simulate.change(inputFile, { target: { files: [iMAGE_FILE_MOCK] } });
        });

        const button = container.querySelector(".custom-button--save");

        act(() => Simulate.click(button));

        const p = container.querySelector(".formulary__message");

        expect(p.textContent).toBe("The description is required");
    });
});