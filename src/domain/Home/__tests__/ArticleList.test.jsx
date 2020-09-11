import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import ArticleList from "../ArticleList";

const ARTICLES_MOCK = [
    {
        _id: 1,
        cover: "image-1.jpg",
        title: "Test title",
        description: "Test description"
    },
    {
        _id: 2,
        cover: "image-2.jpg",
        title: "Test title",
        description: "Test description"
    }
];

let container;

describe("<ArticleList/> component", () => {
    beforeEach(() => {
        fetchMock.doMock();

        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;

        fetchMock.mockReset();
    });

    it("It should call the api correclty", async () => {
        fetchMock.mockOnce(JSON.stringify({
            data: {
                articles: ARTICLES_MOCK
            }
        }));

        await act(async () => {
            render(<ArticleList/>, container);
        });

        const fetchCall = fetchMock.mock.calls[0];
        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/articles?page=2&limit=4");

        const div = document.querySelectorAll("div.row")[1];
        expect(div.children.length).toBe(2);
    });
});