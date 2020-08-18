import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import SkillActions from "../SkillActions";

const SKILL_MOCK = {
    _id: 5,
    name: "React JS"
};

jest.mock("next/link", () => {
    return ({ children }) => {
        return children;
    }
});

jest.mock("../../../../../../components/ConfirmModal", () => {
    return ({ message, onClose }) => {
        onClose(true);
        return <span className="modal-message">{message}</span>;
    }
});

let container;

describe("<SkillActions/> component", () => {
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

        expect(deleteSkillMock).toHaveBeenCalledWith(5);
    });
});