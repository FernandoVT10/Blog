import { act } from "react-dom/test-utils";
import { render } from "react-dom";
import Articles from "../Articles/";

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

let container;

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
            .once(JSON.stringify([]));

            await act(async () => {
                render(<Articles/>, container);
            });
    
            expect(container).toMatchSnapshot();
        });

        it('It should render with data', async () => {
            fetchMock
            .once(JSON.stringify(MOCK_MONTH_VIEWS))
            .once(JSON.stringify(MOCK_DAY_VIEWS));

            await act(async () => {
                render(<Articles/>, container);
            });
    
            expect(container).toMatchSnapshot();
        });
    });
});