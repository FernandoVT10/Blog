import ProjectCard from "../ProjectCard/";
import { act } from "react-dom/test-utils";
import { render } from "react-dom";

const PROJECT_MOCK = {
    _id: 123,
    title: "Test title",
    images: ["test-image-1.jpg", "test-image-2.jpg", "test-image-3.jpg"]
};

let container;

jest.mock("next/router", () => ({
    useRouter: jest.fn(() => ({ query: {} })),
}));

describe("<ProjectCard/> component", () => {
    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });
    
    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it("Check if renders correctly", () => {
        render(<ProjectCard project={PROJECT_MOCK} />, container);

        expect(container).toMatchSnapshot();
    });

    it("It should change the image class", async () => {
        jest.useFakeTimers();

        await act(async () => {
            render(<ProjectCard project={PROJECT_MOCK} />, container);
        });

        const images = container.querySelectorAll("img");

        expect(images[0].classList.contains("project__image--active")).toBeTruthy();

        act(() => {
            jest.runAllTimers(); 
        });

        expect(images[0].classList.contains("project__image--active")).toBeFalsy();
        expect(images[1].classList.contains("project__image--active")).toBeTruthy();
    });
});