import { render } from "react-dom";
import { act } from "react-dom/test-utils";
import AdminLayout from "../AdminLayout";

let container;

describe("<AdminLayout/> component", () => {
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

    it("should call the api correctly", async () => {
        await act(async () => {
            render(<AdminLayout/>, container);
        });

        const fetchCall = fetchMock.mock.calls[0];

        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/users/isLogged/");
    });

    it("should render the login form", async () => {
        fetchMock.mockOnce(JSON.stringify({
            data: {
                isLogged: false
            }
        }));

        await act(async () => {
            render(<AdminLayout/>, container);
        });

        expect(container.querySelector(".admin-login")).not.toBeNull();
        expect(container.querySelector(".admin-layout")).toBeNull();
    });

    it("should render the dashboard page", async () => {
        fetchMock.mockOnce(JSON.stringify({
            data: {
                isLogged: true
            }
        }));

        await act(async () => {
            render(<AdminLayout/>, container);
        });

        expect(container.querySelector(".admin-layout")).not.toBeNull();
        expect(container.querySelector(".admin-login")).toBeNull();
    });
});