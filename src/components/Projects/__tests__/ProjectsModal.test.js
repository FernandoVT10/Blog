import ProjectsModal from "../ProjectsModal/";
import { act, Simulate } from "react-dom/test-utils";
import { render } from "react-dom";

const PROJECTS_MOCK = [
    {
        _id: 123,
        title: "Test title",
        images: ["test-image-1.jpg", "test-image-2.jpg", "test-image-3.jpg"]
    },
    {
        _id: 124,
        title: "Test title 2",
        images: ["test-image-1.jpg", "test-image-2.jpg", "test-image-3.jpg"]
    },
    {
        _id: 125,
        title: "Test title 3",
        images: ["test-image-1.jpg", "test-image-2.jpg", "test-image-3.jpg"]
    }
];

window.$ = () => ({ modal: jest.fn(), on: jest.fn() });

jest.mock("next/router", () => ({
    useRouter: jest.fn(() => ({ query: { skill: "React JS" } })),
}));

let container;

test("Check if <ProjectsModal/> renders correctly", async () => {
    fetchMock.doMock();

    fetchMock.mockOnce(JSON.stringify(
        PROJECTS_MOCK
    ));

    container = document.createElement('div');
    document.body.appendChild(container);

    await act(async () => {
        render(<ProjectsModal/>, container);
    });

    expect(container).toMatchSnapshot();
});