import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import Messages from "../Messages";

const MESSAGES_MOCK = [
    {
        _id: 1,
        message: "test",
        email: "test@example.com",
        viewed: true
    },
    {
        _id: 2,
        message: "test 2",
        email: "test2@example.com",
        viewed: false
    },
    {
        _id: 3,
        message: "test 3",
        email: "test3@example.com",
        viewed: false
    }
];

let container;

describe("Admin <Messages/> component", () => {
    beforeEach(() => {
        fetchMock.doMock();
        fetchMock.mockOnce(JSON.stringify({
            data: { messages: MESSAGES_MOCK }
        }));

        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        fetchMock.mockReset();
        
        document.body.removeChild(container);
        container = null;
    });

    it("should call the api and set the data correctly", async () => {
        await act(async () => {
            render(<Messages/>, container);
        });

        const messageCards = container.querySelectorAll(".admin-messages-message-card");
        expect(messageCards.length).toBe(3);

        const fetchCall = fetchMock.mock.calls[0];
        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/messages");
    });

    it("should activate and call the api when we click the message card", async () => {
        await act(async () => {
            render(<Messages/>, container);
        });

        fetchMock.mockOnce(JSON.stringify({}));

        const messageCard = container.querySelectorAll(".admin-messages-message-card")[1];

        expect(messageCard.classList.contains(
            "admin-messages-message-card--viewed"
        )).toBeFalsy();

        await act(async () => Simulate.click(messageCard));

        expect(messageCard.classList.contains(
            "admin-messages-message-card--viewed"
        )).toBeTruthy();

        const fetchCall = fetchMock.mock.calls[1];
        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/messages/2");
        expect(fetchCall[1].method).toBe("PUT");
        expect(fetchCall[1].body).toBe(
            JSON.stringify({viewed: true })
        );
    });

    it("should display 'There is not messages available'", async () => {
        fetchMock.mockReset();
        fetchMock.doMock();
        fetchMock.mockOnce(JSON.stringify({
            data: { messages: [] }
        }));

        await act(async () => {
            render(<Messages/>, container);
        });

        const div = container.querySelector(".admin-messages__container");

        expect(div.textContent).toBe("There is not messages available");
    });
});