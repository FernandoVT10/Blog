import { render } from "react-dom";
import ProjectCarousel from "../ProjectCarousel";
import { act, Simulate } from "react-dom/test-utils";

let container;

describe("<ProjectCarousel/> component", () => {
    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it("should render the component with the images", async () => {
        render(<ProjectCarousel title="Test title" images={
            [ "test-1.jpg", "test-2.jpg", "test-3.jpg" ]
        } />, container);

        const images = container.querySelectorAll(".project-carousel__image");

        expect(images.length).toBe(3);
    });

    it("should change and active the image preview", async () => {
        render(<ProjectCarousel title="Test title" images={
            [ "test-1.jpg", "test-2.jpg", "test-3.jpg" ]
        } />, container);

        const images = container.querySelectorAll(".project-carousel__image");

        act(() => Simulate.click(images[2]));

        const previewImageContainer = container.querySelector(".project-carousel__image-preview");
        const previewImage = previewImageContainer.querySelector("img");

        expect(previewImageContainer.classList.contains("project-carousel__image-preview--active")).toBeTruthy();
        expect(previewImage.src).toBe("http://localhost/img/projects/test-3.jpg");
    });
});