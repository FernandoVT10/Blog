import { act } from "react-dom/test-utils";
import { render } from "react-dom";
import Views from "../Views";

const MOCK_TOTAL_VIEWS = {
    total: 3319519,
    month: 22112,
    day: 5564
};

let container;

// Mock Chart JS

class ChartMock {
    static defaults = {
        global: {
            elements: {
                point: {}
            },
            legend: {}
        }
    };

    constructor(_, options) {
        this.data = options.data;
    }

    update() {}
}

window.Chart = ChartMock;

// Mock the canvas context

document.getElementById = () => ({ getContext: jest.fn() });

describe("<Views/> Component", () => {
    beforeEach(() => {
        fetchMock.doMock();

        container = document.createElement("div");
        document.body.appendChild(container);
    });
    
    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it("It should call the api correctly", async () => {
        fetchMock
            .once(JSON.stringify([]))
            .once(JSON.stringify(MOCK_TOTAL_VIEWS));

        await act(async () => {
            render(<Views/>, container);
        });

        const fetchCall = fetchMock.mock.calls[1];
        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/articles/views/getTotalViews/");
    });

    it("should set the data correctly", async () => {
        fetchMock
            .once(JSON.stringify([]))
            .once(JSON.stringify({
                data: { views: MOCK_TOTAL_VIEWS }
            }));

        await act(async () => {
            render(<Views/>, container);
        });

        const viewsNumbers = container.querySelectorAll(".dashboard-views__total-views-number");

        expect(viewsNumbers[0].textContent).toBe("3 319 519");
        expect(viewsNumbers[1].textContent).toBe("22 112");
        expect(viewsNumbers[2].textContent).toBe("5 564");
    });
});