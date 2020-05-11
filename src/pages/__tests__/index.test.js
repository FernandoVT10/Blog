import { act } from "react-dom/test-utils";
import { render } from "react-dom";
import Index from "../index";

const ARTICLE_MOCKS = [
    {
        _id: 2,
        title: "Test article",
        description: "Test description",
        cover: "article-1.jpg"
    },
    {
        _id: 3,
        title: "Test article 2",
        description: "Test description 2",
        cover: "article-2.jpg"
    },
    {
        _id: 4,
        title: "Test article 3",
        description: "Test description 3",
        cover: "article-3.jpg"
    }
];

let container;

describe("Index page", () => {
    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });
    
    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it('Check if renders correctly', async () => {
        await act(async () => {
            render(<Index articles={ARTICLE_MOCKS}/>, container);
        });

        expect(container).toMatchSnapshot();
    });
});