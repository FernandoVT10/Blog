import ProjectModal from "../ProjectModal/";
import { act } from "react-dom/test-utils";
import { render } from "react-dom";
import { useRouter } from "next/router";

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

useRouter.mockImplementation(jest.fn(() => ({ query: { project: "123wqsa" } })));

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