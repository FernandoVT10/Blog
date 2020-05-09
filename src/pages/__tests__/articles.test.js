import { act } from "react-dom/test-utils";
import { render } from "react-dom";
import Articles from "../articles";

const CATEGORIES_MOCK = [
    { _id: 2, name: "Technology" },
    { _id: 6, name: "Landscapes" },
    { _id: 19, name: "Travels" }
];

const RESPONSE_MOCK = {
    articles: [
        {
            _id: 2,
            title: "Test article",
            description: "Test description",
            cover: "article-1.jpg"
        },
        {
            _id: 3,
            title: "Test article 2",
            description: "Test description 2",
            cover: "article-2.jpg"
        },
        {
            _id: 4,
            title: "Test article 3",
            description: "Test description 3",
            cover: "article-3.jpg"
        }
    ],
    pagination: {
        hasPrevPage: true,
        prevPage: 5,
        hasNextPage: true,
        nextPage: 7,
        pages: [
            { number: 2, active: false },
            { number: 3, active: false },
            { number: 4, active: false },
            { number: 5, active: false },
            { number: 6, active: true },
            { number: 7, active: false },
            { number: 8, active: false }
        ]
    }
};

let container;

describe('Articles page', () => {
    beforeEach(() => {
        fetchMock.doMock();

        fetchMock
            .once(JSON.stringify(CATEGORIES_MOCK))
            .once(JSON.stringify(RESPONSE_MOCK));

        container = document.createElement('div');
        document.body.appendChild(container);
    });
    
    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it('Check if renders correctly', async () => {
        Object.defineProperty(window, 'location', {
            value: {
                search: "?categories=Landscapes&search=Test&offset=2"
            }
        });

        await act(async () => {
            render(<Articles/>, container);
        });

        expect(container).toMatchSnapshot();
    });
});