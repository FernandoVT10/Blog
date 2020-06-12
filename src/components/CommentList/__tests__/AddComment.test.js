import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import AddComment from "../AddComment";

let container;

const COMMENT_MOCK = {
    articleId: 17,
    name: "Test name",
    comment: "Test message"
};

describe("<AddComment/> component", () => {
    beforeEach(() => {
        fetchMock.doMock();

        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        fetchMock.mockReset();

        document.body.removeChild(container);
        container = null;
    });

    it("It should add a comment", async () => {
        const setLoading = jest.fn();
        const addCommentFn = jest.fn();

        fetchMock.mockOnce(JSON.stringify({
            status: true,
            createdComment: COMMENT_MOCK
        }));

        render(
            <AddComment
            articleId={17}
            setLoading={setLoading}
            addComment={addCommentFn}/>,
        container);

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

        const fetchCall = fetchMock.mock.calls[0];

        expect(fetchCall[0]).toBe("http://localhost:3000/api/comments/addComment/");
        expect(fetchCall[1].body).toBe(JSON.stringify(
            {
                articleId:17,
                name:"Test name",
                comment:"Test message"
            }
        ));

        expect(setLoading).toHaveBeenCalledTimes(2);
        expect(addCommentFn).toHaveBeenCalledWith(COMMENT_MOCK);
    });
});