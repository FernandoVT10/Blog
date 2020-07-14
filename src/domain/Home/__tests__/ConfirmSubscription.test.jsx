import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import ConfirmSubscription from "../ConfirmSubscription";

import { useRouter } from "next/router";

let container;

describe("<ConfirmSubscription/> component", () => {
    beforeEach(() => {
        fetchMock.doMock();

        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;

        fetchMock.mockReset();
        useRouter.mockImplementation(() => ({
            query: {},
            pathname: "/"
        }));
    });

    it("It should call the api correctly", async () => {
        fetchMock.mockOnce(JSON.stringify({
            data: {
                message: "Test success message"
            }
        }));

        useRouter.mockImplementation(() => ({
            query: { subscriptionId: "test_id" },
            pathname: "/"
        }));

        await act(async () => {
            render(<ConfirmSubscription/>, container);
        });

        const fetchCall = fetchMock.mock.calls[0];

        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/subscribe/test_id/confirm/");
        expect(fetchCall[1].method).toBe("PUT");
    });

    it("It should display a success message", async () => {
        fetchMock.mockOnce(JSON.stringify({
            data: {
                message: "Test success message"
            }
        }));

        await act(async () => {
            render(<ConfirmSubscription/>, container);
        });

        const div = container.querySelector("div");

        expect(div.classList.contains("home-confirm-subscription--active")).toBeFalsy();
        expect(div.textContent).toBe("");

        useRouter.mockImplementation(() => ({
            query: { subscriptionId: "id" },
            pathname: "/"
        }));

        await act(async () => {
            render(<ConfirmSubscription/>, container);
        });

        expect(div.classList.contains("home-confirm-subscription--active")).toBeTruthy();
        expect(div.textContent).toBe("Test success message");
    });

    it("It should display an error message", async () => {
        fetchMock.mockOnce(JSON.stringify({
            errors: [
                {
                    status: 200,
                    message: "Error message"
                }
            ]
        }));

        useRouter.mockImplementation(() => ({
            query: { subscriptionId: "id" },
            pathname: "/"
        }));

        await act(async () => {
            render(<ConfirmSubscription/>, container);
        });

        const div = container.querySelector("div");

        expect(div.classList.contains("home-confirm-subscription--active")).toBeTruthy();
        expect(div.textContent).toBe("The subscription is invalid");
    });
});