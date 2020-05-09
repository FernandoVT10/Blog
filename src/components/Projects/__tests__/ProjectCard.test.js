import ProjectCard from "../ProjectCard/";
import { act, Simulate } from "react-dom/test-utils";
import { render } from "react-dom";
import { useRouter } from "next/router";

const PROJECT_MOCK = {
    _id: 123,
    title: "Test title",
    images: ["test-image-1.jpg", "test-image-2.jpg", "test-image-3.jpg"]
};

let container;

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

    it("It should call router.push", async () => {
        const routerPush = jest.fn();

        useRouter.mockImplementation(() => ({
            query: { },
            pathname: "/",
            push: routerPush
        }));

        await act(async () => {
            render(<ProjectCard project={PROJECT_MOCK} />, container);
        });

        const div = container.querySelector("div");

        act(() => {
            Simulate.click(div);
        });

        expect(routerPush).toHaveBeenCalledWith({
            pathname: "/",
            query: { project:  123 }
        });
    });
});