import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import ProjectEditor from "../ProjectEditor";

const SKILLS_MOCK = [
    { name: "React JS" },
    { name: "Node JS" },
    { name: "GraphQL" }
];

URL.createObjectURL = () => "testURL.jpg";

let container;

describe("<ProjectEditor/> component", () => {
    beforeEach(() => {
        fetchMock.doMock();

        fetchMock.mockOnce(JSON.stringify({}));

        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        fetchMock.mockReset();

        document.body.removeChild(container);
        container = null;
    });

    it("should display a loading screen", () => {
        render(<ProjectEditor loading={true}/>, container);
        expect(container.querySelector(".spinner-border")).not.toBeNull();
    });

    it("should display a not found screen", () => {
        render(<ProjectEditor projectNotFound={true}/>, container);
        const div = container.querySelector(".project-editor__container");
        expect(div.textContent).toBe("The project doesn't exist");
    });

    it("should call setTitle", async () => {
        const setTitleMock = jest.fn();

        await act(async () => {
            render(
                <ProjectEditor
                title="test"
                setTitle={setTitleMock}
                images={[]}/>
            , container); 
        });

        const input = container.querySelector(".project-editor__input");

        act(() => {
            input.value = "test title";
            Simulate.change(input);
        });

        expect(setTitleMock).toHaveBeenCalledWith("test title");
    });

    it("should call setCurrentImages", async () => {
        const setCurrentImagesMock = jest.fn();

        await act(async () => {
            render(
                <ProjectEditor
                currentImages={["test-1.jpg"]}
                setCurrentImages={setCurrentImagesMock}
                images={["test-1.jpg"]}/>
            , container); 
        });

        const removeButton = container.querySelector(".project-editor-carousel__remove-image");

        act(() => Simulate.click(removeButton));

        expect(setCurrentImagesMock).toHaveBeenCalledWith([]);
    });

    it("should call setImageFiles", async () => {
        const setImageFilesMock = jest.fn();

        const image = {
            type: "image/jpg",
            name: "test.jpg"
        };

        await act(async () => {
            render(
                <ProjectEditor
                imageFiles={[]}
                setImageFiles={setImageFilesMock}
                images={[]}/>
            , container);
        });

        const inputFile = container.querySelector(".project-editor-carousel__input-file");

        act(() => Simulate.change(inputFile, { target: { files: [image] } }));

        expect(setImageFilesMock).toHaveBeenCalled();
    });

    it("should call setDescription", async () => {
        const setDescriptionMock = jest.fn();

        await act(async () => {
            render(
                <ProjectEditor
                description="test"
                setDescription={setDescriptionMock}
                images={[]}/>
            , container); 
        });

        const textarea = container.querySelector(".project-editor__textarea");

        act(() => {
            textarea.value = "test description";
            Simulate.change(textarea);
        });

        expect(setDescriptionMock).toHaveBeenCalledWith("test description");
    });

    it("should call setSkills", async () => {
        fetchMock.mockReset();

        fetchMock.mockOnce(JSON.stringify({
            data: { skills: SKILLS_MOCK }
        }));

        const setSkillsMock = jest.fn();

        await act(async () => {
            render(
                <ProjectEditor
                skills={["GraphQL"]}
                setSkills={setSkillsMock}
                images={[]}/>
            , container); 
        });

        const graphQLCheckbox = container.querySelector("#skill-GraphQL");

        act(() => Simulate.change(graphQLCheckbox));

        expect(setSkillsMock).toHaveBeenCalledWith([]);
    });

    it("should call handleButton", async () => {
        const handleButtonMock = jest.fn();

        await act(async () => {
            render(
                <ProjectEditor
                handleButton={handleButtonMock}
                images={[]}/>
            , container); 
        });

        const button = container.querySelector(".custom-button--save");

        act(() => Simulate.click(button));

        expect(handleButtonMock).toHaveBeenCalled();
    });

    it("should call setModalActive", async () => {
        const setModalActiveMock = jest.fn();

        await act(async () => {
            render(
                <ProjectEditor
                setModalActive={setModalActiveMock}
                images={[]}/>
            , container); 
        });

        const button = container.querySelector(".custom-button--cancel");

        act(() => Simulate.click(button));

        expect(setModalActiveMock).toHaveBeenCalled();
    });

    it("should display the error text", async () => {
        await act(async () => {
            render(
                <ProjectEditor
                images={[]}/>
            , container); 
        });

        expect(container.querySelector("p")).toBeNull();

        act(() => {
            render(
                <ProjectEditor
                errorMessage="This is a error message"
                images={[]}/>
            , container); 
        });

        const p = container.querySelector("p");

        expect(p.textContent).toBe("This is a error message");
    });
});