import { act, Simulate } from "react-dom/test-utils";
import { render } from "react-dom";
import Article from "../article/[articleId]";

const ARTICLE_MOCK = {
    _id: 18,
    title: "Test Article",
    description: "Test description",
    cover: "cover.jpg",
    content: "Test content",
    categories: [
        { name: "React JS" },
        { name: "Node JS" }
    ]
};

const COMMENT_MOCKS = [
    {
        _id: 1,
        name: "Test name",
        comment: "This is a test"
    },
    {
        _id: 2,
        name: "Test name 2",
        comment: "This is a test"
    },
    {
        _id: 3,
        name: "Test name 3",
        comment: "This is a test"
    }
];

let container;

describe("Index page", () => {
    beforeEach(() => {
        fetchMock.doMock();

        fetchMock.mockOnce(JSON.stringify(
            COMMENT_MOCKS
        ));

        container = document.createElement('div');
        document.body.appendChild(container);
    });
    
    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it('Check if renders correctly', async () => {
        await act(async () => {
            render(<Article article={ARTICLE_MOCK}/>, container);
        });

        expect(container).toMatchSnapshot();
    });

    it('It should load more comments', async () => {
        await act(async () => {
            render(<Article article={ARTICLE_MOCK}/>, container);
        });

        const button = container.querySelector(".comments__load-more");

        fetchMock.once(JSON.stringify(
            {
                _id: 4,
                name: "Test name 4",
                comment: "This is a test 4"
            }
        ));

        await act(async () => {
            Simulate.click(button); 
        });

        const comments = container.querySelectorAll(".comment");

        const commentName = comments[3].querySelector(".comment__name").textContent;
        const commentContent = comments[3].querySelector(".comment__content").textContent;

        expect(comments.length).toBe(4);
        expect(commentName).toBe("Test name 4");
        expect(commentContent).toBe("This is a test 4");
    });

    it('It should create a comment', async () => {
        await act(async () => {
            render(<Article article={ARTICLE_MOCK}/>, container);
        });

        const input = container.querySelector("input");
        const textarea = container.querySelector("textarea");
        const form = container.querySelector("form");

        fetchMock.once(JSON.stringify(
            {
                status: true,
                createdComment: {
                    _id: 45,
                    name: "Test name 45",
                    comment: "This is a test 45"
                }
            }
        ));

        act(() => {
            input.value = "Test name 45";
            textarea.value = "This is a test 45";

            Simulate.change(input);
            Simulate.change(textarea);
        });

        await act(async () => {
            Simulate.submit(form); 
        });

        const comments = container.querySelectorAll(".comment");

        const commentName = comments[0].querySelector(".comment__name").textContent;
        const commentContent = comments[0].querySelector(".comment__content").textContent;

        expect(comments.length).toBe(4);
        expect(commentName).toBe("Test name 45");
        expect(commentContent).toBe("This is a test 45");
    });
});