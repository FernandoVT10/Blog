import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import SkillCard from "../SkillCard";

const SKILL_MOCK = {
    _id: 5,
    name: "React JS"
};

jest.mock("../ProjectCardList", () => {
    return ({ skillName, isActive }) => {
        return (
            <div>
                <span className="test-skill-name">{skillName}</span>
                <span className="test-is-active">
                    {isActive ? "isActive" : "notIsActive"}
                </span>
            </div>
        );
    }
});

jest.mock("../SkillActions", () => {
    return ({ skill,  deleteSkill, setIsEditing }) => {
        return (
            <div>
                <button
                className="test-delete-button"
                onClick={() => deleteSkill(skill._id)}></button>
                <button
                className="test-edit-button"
                onClick={() => setIsEditing(true)}></button>
            </div>
        );
    };
});

let container;

describe("Domain Projects <SkillCard/> component", () => {
    beforeEach(() => {

        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it("should activate and desactivate the ProjectCardList", () => {
        render(
            <SkillCard
            skill={SKILL_MOCK}
            deleteSkill={() => {}}
            updateSkillName={() => {}} />
        , container);

        const isActive = container.querySelector(".test-is-active");
        expect(isActive.textContent).toBe("notIsActive");

        const span = container.querySelector("span.custom-table__article__title");
        act(() => Simulate.click(span));

        expect(isActive.textContent).toBe("isActive");
    });

    it("should call deleteSkill", () => {
        const deleteSkillMock = jest.fn();

        render(
            <SkillCard
            skill={SKILL_MOCK}
            deleteSkill={deleteSkillMock}
            updateSkillName={() => {}} />
        , container);

        const button = container.querySelector(".test-delete-button");
        act(() => Simulate.click(button));

        expect(deleteSkillMock).toHaveBeenCalledWith(5);
    });

    it("should activate the edit mode", () => {
        render(
            <SkillCard
            skill={SKILL_MOCK}
            deleteSkill={() => {}}
            updateSkillName={() => {}} />
        , container);

        expect(container.querySelector(".admin-skill-list-skill-input")).toBeNull();

        const button = container.querySelector(".test-edit-button");
        act(() => Simulate.click(button));

        expect(container.querySelector(".admin-skill-list-skill-input")).not.toBeNull();
    });

    it("should call updateSkillName", () => {
        const updateSkillNameMock = jest.fn();

        render(
            <SkillCard
            skill={SKILL_MOCK}
            deleteSkill={() => {}}
            updateSkillName={updateSkillNameMock} />
        , container);

        const button = container.querySelector(".test-edit-button");
        act(() => Simulate.click(button));

        const input = container.querySelector("input");
        const form = container.querySelector("form");

        act(() => {
            input.value = "updated skill"
            Simulate.change(input);
        });

        act(() => Simulate.submit(form));

        expect(updateSkillNameMock).toHaveBeenCalledWith(5, "updated skill");
        expect(container.querySelector(".admin-skill-list-skill-input")).toBeNull();
    });

    it("should turn off edit mode with the OnBlur function", () => {
        render(
            <SkillCard
            skill={SKILL_MOCK}
            deleteSkill={() => {}}
            updateSkillName={() => {}} />
        , container);

        const button = container.querySelector(".test-edit-button");
        act(() => Simulate.click(button));

        const input = container.querySelector("input");

        act(() => Simulate.blur(input));

        expect(container.querySelector(".admin-skill-list-skill-input")).toBeNull();
    });
});