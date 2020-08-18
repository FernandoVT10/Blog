import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import SkillEditor from "../SkillEditor";

URL.createObjectURL = () => "TestURL.jpg";

let container;

describe("<SkillEditor/> component", () => {
    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it("should render loading screen", () => {
        render(<SkillEditor loading={true} />, container);
        expect(container.querySelector(".spinner-border")).not.toBeNull();
    });

    it("should render not found screen", () => {
        render(<SkillEditor skillNotFound={true} />, container);
        const div = container.querySelector(".skill-editor__container");
        expect(div.textContent).toBe("The skill doesn't exist");
    });

    it("should call setName", () => {
        const setNameMock = jest.fn();

        render(<SkillEditor name="name" setName={setNameMock} />, container);

        const nameInput = container.querySelector("input[type='text']");

        act(() => {
            nameInput.value = "test name";
            Simulate.change(nameInput);
        });

        expect(setNameMock).toHaveBeenCalledWith("test name");
    });

    it("should call setImageFile", () => {
        const setImageFileMock = jest.fn();

        render(<SkillEditor name="" setImageFile={setImageFileMock} />, container);

        const fileInput = container.querySelector("input[type='file']");

        const image = { type: "image/jpg" }

        act(() => Simulate.change(fileInput, { target: { files: [image] } }));

        expect(setImageFileMock).toHaveBeenCalledWith(image);
    });

    it("should call setColor", () => {
        const setColorMock = jest.fn();

        render(<SkillEditor color="#000000" setColor={setColorMock} />, container);

        const colorInput = container.querySelector("input[type='color']");

        act(() => {
            colorInput.value = "#ffffff";
            Simulate.change(colorInput);
        });

        expect(setColorMock).toHaveBeenCalledWith("#ffffff");
    });

    it("should call handleButton", () => {
        const handleButtonMock = jest.fn();

        render(<SkillEditor handleButton={handleButtonMock} />, container);

        const button = container.querySelector(".custom-button--save");

        act(() => Simulate.click(button));

        expect(handleButtonMock).toBeCalled();
    });

    it("should call setModalActive", () => {
        const setModalActiveMock = jest.fn();

        render(<SkillEditor setModalActive={setModalActiveMock} />, container);

        const button = container.querySelector(".custom-button--cancel");

        act(() => Simulate.click(button));

        expect(setModalActiveMock).toBeCalled();
    });

    it("should diplay an error message", () => {
        render(<SkillEditor errorMessage="This is a error message" />, container);

        const p = container.querySelector("p");

        expect(p.textContent).toBe("This is a error message");
    });
});