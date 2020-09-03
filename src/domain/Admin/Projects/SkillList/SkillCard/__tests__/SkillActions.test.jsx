import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import SkillActions from "../SkillActions";

const SKILL_MOCK = {
    _id: 5,
    name: "React JS"
};

jest.mock("@/components/ConfirmModal", () => {
    return ({ message, onClose }) => {
        return (
            <div>
                <span className="modal-message">{message}</span>
                <button
                className="modal-close-button"
                onClick={() => onClose(true)}></button>
            </div>
        );
    }
});

let container;

describe("Domain Projects <SkillActions/> component", () => {
    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it("should set the skill correctly", () => {
        render(
            <SkillActions
            skill={SKILL_MOCK}
            deleteSkill={() => {}} />
        , container);

        const modalMessage = container.querySelector(".modal-message");
        
        expect(modalMessage.textContent).toBe("Are you sure to delete \"React JS\"?");
    });

    it("should call deleteSkill", () => {
        const deleteSkillMock = jest.fn();

        act(() => {
            render(
                <SkillActions
                skill={SKILL_MOCK}
                deleteSkill={deleteSkillMock}/>
            , container);
        });

        const button = container.querySelector(".modal-close-button");
        act(() => Simulate.click(button));

        expect(deleteSkillMock).toHaveBeenCalledWith(5);
    });

    it("should call setIsEditing", () => {
        const setIsEditingMock = jest.fn();

        act(() => {
            render(
                <SkillActions
                skill={SKILL_MOCK}
                setIsEditing={setIsEditingMock}/>
            , container);
        });

        const button = container.querySelector(".custom-table__button--edit");
        act(() => Simulate.click(button));

        expect(setIsEditingMock).toHaveBeenCalledWith(true);
    });
});