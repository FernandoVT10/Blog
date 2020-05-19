import { act } from "react-dom/test-utils";
import { render } from "react-dom";
import Chart from "../Chart/";

const MOCK_DAY_VIEWS = [
    {
        _id: 1,
        title: "Day view mock #1",
        cover: "day-cover-1.jpg",
        views: 3951
    },
    {
        _id: 2,
        title: "Day view mock #2",
        cover: "day-cover-2.jpg",
        views: 1915
    },
    {
        _id: 3,
        title: "Day view mock #1",
        cover: "day-cover-1.jpg",
        views: 1422
    }
];
const MOCK_MONTH_VIEWS = [
    {
        _id: 1,
        title: "Month view mock #1",
        cover: "month-cover-1.jpg",
        views: 3951
    },
    {
        _id: 2,
        title: "Month view mock #2",
        cover: "month-cover-2.jpg",
        views: 1915
    },
    {
        _id: 3,
        title: "Month view mock #1",
        cover: "month-cover-1.jpg",
        views: 1422
    }
];

// Mock Chart js

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

let container;

describe('<Chart/> Component', () => {
    beforeEach(() => {
        fetchMock.doMock();

        container = document.createElement('div');
        document.body.appendChild(container);
    });
    
    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it("Check if renders correctly", async () => {
        fetchMock.mockResponse(JSON.stringify(MOCK_DAY_VIEWS));

        document.getElementById = () => ({ getContext: jest.fn() });

        await act(async () => {
            render(<Chart/>, container);
        });

        expect(container).toMatchSnapshot();
    });
});