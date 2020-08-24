import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import MessageCard from "../MessageCard";

let container;

describe("Admin Messages <MessageCard/> component", () => {
    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it("should call setActiveMessage", () => {
        const setActiveMessageMock = jest.fn();

        const message = {
            _id: 1,
            message: "test",
            email: "test@example.com",
            viewed: true
        };

        render(
            <MessageCard message={message} setActiveMessage={setActiveMessageMock}/>
        , container);

        const div = container.querySelector("div");

        act(() => Simulate.click(div));

        expect(setActiveMessageMock).toHaveBeenCalledWith(message);
    });

    it("should call activeViewed", () => {
        const activeViewedMock = jest.fn();

        const message = {
            _id: "abcdef",
            message: "test",
            email: "test@example.com",
            viewed: false
        };

        render(
            <MessageCard
            message={message}
            setActiveMessage={() => {}}
            activeViewed={activeViewedMock}/>
        , container);

        const div = container.querySelector("div");

        act(() => Simulate.click(div));

        expect(activeViewedMock).toHaveBeenCalledWith(message._id);
    });
});