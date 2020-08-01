import { act } from "react-dom/test-utils";
import { render } from "react-dom";
import Chart from "../Chart";

const MOCK_DAY_VIEWS = [
    {
        _id: 1,
        name: "Monday",
        cover: "day-cover-1.jpg",
        views: 3951
    },
    {
        _id: 2,
        name: "Tuesday",
        cover: "day-cover-2.jpg",
        views: 1915
    },
    {
        _id: 3,
        name: "Wednesday",
        cover: "day-cover-1.jpg",
        views: 1422
    }
];
const MOCK_MONTH_VIEWS = [
    {
        _id: 1,
        name: "January",
        cover: "month-cover-1.jpg",
        views: 3951
    },
    {
        _id: 2,
        name: "February",
        cover: "month-cover-2.jpg",
        views: 1915
    },
    {
        _id: 3,
        name: "March",
        cover: "month-cover-1.jpg",
        views: 1422
    }
];

// Mock Chart js

const ChartConstructorMock = jest.fn();
const ChartUpdateMock = jest.fn();

class ChartMock {
    static defaults = {
        global: {
            elements: {
                point: {}
            },
            legend: {}
        }
    };

    constructor(ctx, options) {
        ChartConstructorMock(ctx, options);
        this.data = { labels: [], datasets: [{ data: [] }] };
    }

    update() {
        ChartUpdateMock(this.data);
    }
}

let container;

describe("<Chart/> Component", () => {
    beforeEach(() => {
        window.Chart = ChartMock;
        ChartConstructorMock.mockReset();
        ChartUpdateMock.mockReset();

        fetchMock.doMock();

        fetchMock.mockResponse(JSON.stringify({
            data: {
                views: MOCK_MONTH_VIEWS
            }
        }));

        container = document.createElement("div");
        document.body.appendChild(container);
    });
    
    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it("should inititialize ChartJS correctly", async () => {
        document.getElementById = () => ({
            getContext: () => "Test ctx"
        });

        await act(async () => {
            render(<Chart type="month"/>, container);
        });

        const { global } = window.Chart.defaults;

        // console.log(ChartConstructorMock.mock.calls);

        expect(global.elements.point.borderWidth).toBe(8);
        expect(global.defaultFontSize).toBe(18);
        expect(global.defaultFontColor).toBe("white");
        expect(global.legend.display).toBe(false);
        expect(global.maintainAspectRatio).toBe(false);
        expect(ChartConstructorMock).toHaveBeenCalledWith("Test ctx", {
            type: "line",
            data: {
                labels: ["January", "February", "March", "April", "May"],
                datasets: [
                    { 
                        data: [0, 0, 0, 0, 0],
                        label: "Views",
                        borderColor: "#8BD1FF",
                        fill: false
                    }
                ]
            }
        });
    });

    it("should call the api correclty and set the data in the chart", async () => {
        await act(async () => {
            render(<Chart type="month"/>, container);
        });

        const fetchCall = fetchMock.mock.calls[0];

        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/articles/views?type=month&limit=5");
        expect(ChartUpdateMock).toHaveBeenCalledWith({
            labels: ["March", "February", "January"],
            datasets: [
                {
                    data: [1422, 1915, 3951]
                }
            ]
        });
    });

    it("should call the api and set the new data when we change the type prop", async () => {
        await act(async () => {
            render(<Chart type="month"/>, container);
        });

        let fetchCall = fetchMock.mock.calls[0];
        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/articles/views?type=month&limit=5");
        expect(ChartUpdateMock).toHaveBeenCalledWith({
            labels: ["March", "February", "January"],
            datasets: [
                {
                    data: [1422, 1915, 3951]
                }
            ]
        });

        fetchMock.mockReset();
        fetchMock.mockResponse(JSON.stringify({
            data: {
                views: MOCK_DAY_VIEWS
            }
        }));

        await act(async () => {
            render(<Chart type="day"/>, container);
        });

        fetchCall = fetchMock.mock.calls[0];
        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/articles/views?type=day&limit=5");
        expect(ChartUpdateMock).toHaveBeenCalledWith({
            labels: ["Wednesday", "Tuesday", "Monday"],
            datasets: [
                {
                    data: [1422, 1915, 3951]
                }
            ]
        });
    });
});