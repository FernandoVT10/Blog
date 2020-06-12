import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import CommentList from "../CommentList";

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

describe("<CommentList/> component", () => {
    beforeEach(() => {
        fetchMock.doMock();

        fetchMock.mockOnce(JSON.stringify(COMMENT_MOCKS));
        
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        fetchMock.mockReset();

        document.body.removeChild(container);
        container = null;
    });

    it("It should render the first comments", async () => {
        await act(async () => {
            render(<CommentList articleId={19}/>, container);
        });

        const commentListContainer = container.querySelector(".comment-list__container");
        
        commentListContainer.childNodes.forEach((comment, index) => {
            const p = comment.querySelectorAll("p");

            expect(p[0].textContent).toBe(COMMENT_MOCKS[index].name);
            expect(p[1].textContent).toBe(COMMENT_MOCKS[index].comment);
        });

        const fetchCall = fetchMock.mock.calls[0];

        expect(fetchCall[0]).toBe("http://localhost:3000/api/comments/getComments/19/10/0");
    });

    it("It should add a comment", async () => {
        await act(async () => {
            render(<CommentList articleId={19}/>, container);
        });

        fetchMock.mockOnce(JSON.stringify({
            status: true,
            createdComment: {
                _id: 4,
                name: "Test name 4",
                comment: "Test message 4"
            }
        }));

        const input = container.querySelector("input");
        const textarea = container.querySelector("textarea");

        act(() => {
            input.value = "Test name";
            Simulate.change(input);

            textarea.value = "Test message";
            Simulate.change(textarea);
        });

        const form = container.querySelector("form");

        await act(async () => {
            Simulate.submit(form);
        });

        const commentListContainer = container.querySelector(".comment-list__container");

        const p = commentListContainer.firstChild.querySelectorAll("p");

        expect(commentListContainer.childNodes.length).toBe(4);
        expect(p[0].textContent).toBe("Test name 4");
        expect(p[1].textContent).toBe("Test message 4");
    });

    it("It should load more comments", async () => {
        await act(async () => {
            render(<CommentList articleId={19}/>, container);
        });

        fetchMock.mockOnce(JSON.stringify([
            {
                _id: 4,
                name: "Test name 4",
                comment: "Test message 4"
            },
            {
                _id: 5,
                name: "Test name 5",
                comment: "Test message 5"
            }
        ]));

        const button = container.querySelector(".comment-list__load-more");

        await act(async () => {
            Simulate.click(button);
        });

        const fetchCall = fetchMock.mock.calls[1];
        expect(fetchCall[0]).toBe("http://localhost:3000/api/comments/getComments/19/10/10");
        
        const commentListContainer = container.querySelector(".comment-list__container");
        const p = commentListContainer.lastChild.querySelectorAll("p");

        expect(p[0].textContent).toBe("Test name 5");
        expect(p[1].textContent).toBe("Test message 5");
        expect(commentListContainer.childNodes.length).toBe(5);
    });
});