import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import ImagesCarousel from "../ImagesCarousel";

const IMAGE_MOCK = {
    type: "image/jpg",
    name: "Test name"
}

URL.createObjectURL = () => "testURL.jpg";

let container;

describe("<ImagesCarousel/> component", () => {
    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    describe("Render Images", () => {
        it("should render the images correctly", () => {
            act(() => {
                render(<ImagesCarousel images={[
                    "test-1.jpg", "test-2.jpg", "test-3.jpg"
                ]}/>, container);
            });
    
            const activeImage = container.querySelector("img");
            expect(/.\/img\/projects\/test-1\.jpg/.test(activeImage.src)).toBeTruthy();
    
            const projectImages = container.querySelectorAll(".project-editor-carousel__image");
    
            expect(/.\/img\/projects\/test-1\.jpg/.test(projectImages[0].src)).toBeTruthy();
            expect(/.\/img\/projects\/test-2\.jpg/.test(projectImages[1].src)).toBeTruthy();
            expect(/.\/img\/projects\/test-3\.jpg/.test(projectImages[2].src)).toBeTruthy();
        });
    
        it("shouldn't render the active image", () => {
            act(() => {
                render(<ImagesCarousel images={[]}/>, container);
            });
    
            expect(container.querySelector("img")).toBeNull();
        });
    
        it("should change the active image", () => {
            act(() => {
                render(<ImagesCarousel images={[
                    "test-1.jpg", "test-2.jpg", "test-3.jpg"
                ]}/>, container);
            });
    
            const activeImage = container.querySelector("img");
            expect(/.test-1\.jpg/.test(activeImage.src)).toBeTruthy();
    
            const imageContainers = container.querySelectorAll(
                ".project-editor-carousel__image-container"
            );
    
            act(() => Simulate.click(imageContainers[2]));
    
            expect(/.test-3\.jpg/.test(activeImage.src)).toBeTruthy();
        });    
    });

    describe("Remove Image", () => {
        it("should remove an image and call setCurrentImages", () => {
            const setCurrentImagesMock = jest.fn();
    
            act(() => {
                render(
                <ImagesCarousel
                images={["test-1.jpg", "test-2.jpg", "test-3.jpg"]}
                setCurrentImages={setCurrentImagesMock}
                currentImages={["test-1.jpg", "test-2.jpg", "test-3.jpg"]}/>
                , container);
            });
    
            const removeImageButtons = container.querySelectorAll("button");
    
            act(() => Simulate.click(removeImageButtons[1]));
    
            expect(setCurrentImagesMock).toHaveBeenCalledWith(["test-1.jpg", "test-3.jpg"]);
        });

        it("should remove an image and call setImageFiles", () => {
            const setImageFilesMock = jest.fn();
    
            act(() => {
                render(
                <ImagesCarousel
                images={["test-1.jpg", "test-2.jpg", "test-3.jpg"]}
                setImageFiles={setImageFilesMock}
                imageFiles={[IMAGE_MOCK]}/>
                , container);
            });

            const inputFile = container.querySelector("input");

            act(() => Simulate.change(inputFile, { target: { files: [IMAGE_MOCK] } }));

            setImageFilesMock.mockReset();

            const removeImageButtons = container.querySelectorAll("button");

            act(() => Simulate.click(removeImageButtons[3]));

            expect(setImageFilesMock).toBeCalledWith([]);
        });

        it("should change the active image", () => {
            act(() => {
                render(
                <ImagesCarousel
                images={["test-1.jpg", "test-2.jpg", "test-3.jpg"]}
                setCurrentImages={() => {}}
                currentImages={["test-1.jpg", "test-2.jpg", "test-3.jpg"]}/>
                , container);
            });

            const imageContainers = container.querySelectorAll(
                ".project-editor-carousel__image-container"
            );
    
            act(() => Simulate.click(imageContainers[2]));
    
            const removeImageButtons = container.querySelectorAll("button");
            act(() => Simulate.click(removeImageButtons[1]));

            const activeImage = container.querySelector("img");
            expect(/.test-3\.jpg/.test(activeImage.src)).toBeTruthy();
        });
    });

    describe("Add Image", () => {
        it("should add an image and call setImageFiles", () => {
            const setImageFilesMock = jest.fn();
    
            act(() => {
                render(
                <ImagesCarousel
                images={[]}
                setImageFiles={setImageFilesMock}
                imageFiles={[]}/>
                , container);
            });

            const inputFile = container.querySelector("input");

            act(() => Simulate.change(inputFile, { target: { files: [IMAGE_MOCK] } }));

            const images = setImageFilesMock.mock.calls[0][0]([]);

            expect(images).toEqual([IMAGE_MOCK]);

            const projectImage = container.querySelector(".project-editor-carousel__image");
    
            expect(/.testURL\.jpg/.test(projectImage.src)).toBeTruthy();
        });
    });
});