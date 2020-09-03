import { render } from "react-dom";
import { act } from "react-dom/test-utils";
import ProjectCard from "../ProjectCard";

const PROJECT_MOCK = {
    _id: 1,
    title: "Test"
};

jest.mock("next/link", () => {
    return ({ children }) => {
        return children;
    }
});

jest.mock("@/components/ConfirmModal", () => {
    return ({ message, onClose }) => {
        onClose(true);
        return <span className="modal-message">{message}</span>;
    }
});

let container;

describe("Domain Projects <ProjectCard/> component", () => {
    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it("should set the project correclty", () => {
        act(() => {
            render(
                <ProjectCard
                project={PROJECT_MOCK}
                deleteProject={() => {}}/>
            , container);
        });

        const a = container.querySelector("a");
        expect(a.textContent).toBe("Test");

        const modalMmessage = container.querySelector(".modal-message");
        expect(modalMmessage.textContent).toBe("Are you sure to delete \"Test\"?");
    });

    it("should call deleteProject", () => {
        const deleteProjectMock = jest.fn();

        act(() => {
            render(
                <ProjectCard
                project={PROJECT_MOCK}
                deleteProject={deleteProjectMock}/>
            , container);
        });

        expect(deleteProjectMock).toHaveBeenCalledWith(1);
    });
});