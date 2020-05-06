import ProjectModal from "../ProjectModal/";
import { act, Simulate } from "react-dom/test-utils";
import { render } from "react-dom";

const PROJECT_MOCK = {
    _id: 123,
    title: "Test title",
    description: "This is a test description",
    skills: [
        {
            _id: 21,
            name: "React JS"
        },
        {
            _id: 22,
            name: "Node JS"
        }
    ],
    images: ["test-image-1.jpg", "test-image-2.jpg", "test-image-3.jpg"]
};

window.$ = () => ({ modal: jest.fn(), on: jest.fn() });

jest.mock("next/router", () => ({
    useRouter: jest.fn(() => ({ query: { project: "123wqsa" } })),
}));

let container;

describe("<ProjectModal/> component", () => {
    beforeEach(() => {
        fetchMock.doMock();

        fetchMock.mockOnce(JSON.stringify(
            PROJECT_MOCK
        ));

        container = document.createElement('div');
        document.body.appendChild(container);
    });
    
    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it("Check if renders correctly", async () => {
        await act(async () => {
            render(<ProjectModal/>, container);
        });

        expect(container).toMatchSnapshot();
    });
});