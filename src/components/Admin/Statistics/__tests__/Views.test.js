import { act } from "react-dom/test-utils";
import { render } from "react-dom";
import Views from "../Views/";

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

describe('<Articles/> Component', () => {
    beforeEach(() => {
        fetchMock.doMock();

        container = document.createElement('div');
        document.body.appendChild(container);
    });
    
    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    describe("Check if renders correctly", () => {
        it('It should render without data', async () => {
            fetchMock
                .once(JSON.stringify([]))
                .once(JSON.stringify({}));

            await act(async () => {
                render(<Views/>, container);
            });
    
            expect(container).toMatchSnapshot();
        });

        it('It should render with data', async () => {
            fetchMock
                .once(JSON.stringify([]))
                .once(JSON.stringify(MOCK_TOTAL_VIEWS));

            await act(async () => {
                render(<Views/>, container);
            });
    
            expect(container).toMatchSnapshot();
        });
    });
});