import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import SkillCard from "../SkillCard";

const PROJECTS_MOCK = [
    {
        _id: 1,
        title: "Test"
    },
    {
        _id: 2,
        title: "Test 2"
    },
    {
        _id: 3,
        title: "Test 3"
    }
];

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
    return ({ message, prefix, onClose }) => {
        return (
            <span id={`confirm-modal-${prefix}`} onClick={onClose}>
                { message }
            </span>
        );
    }
});

let container;

describe("<SkillCard/> component", () => {
    beforeEach(() => {
        fetchMock.doMock();

        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        fetchMock.mockReset();

        document.body.removeChild(container);
        container = null;
    });

    it("should call the api to load the projects correctly", async () => {
        render(
            <SkillCard
            skill={SKILL_MOCK}
            deleteSkill={() => {}} />
        , container);

        fetchMock.mockOnce(JSON.stringify({
            data: { projects: PROJECTS_MOCK }
        }));

        const span = container.querySelector("span");
        await act(async () => Simulate.click(span));

        const projectList = container.querySelector(
            ".admin-skill-list-skill-card__project-list"
        );
        expect(projectList.children.length).toBe(3);

        const fetchCall = fetchMock.mock.calls[0];
        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/projects?skill=React JS");
    });

    it("should display a projects not found message", async () => {
        render(
            <SkillCard
            skill={SKILL_MOCK}
            deleteSkill={() => {}} />
        , container);

        fetchMock.mockOnce(JSON.stringify({
            data: { projects: [] }
        }));

        const span = container.querySelector("span");
        await act(async () => Simulate.click(span));

        const div = container.querySelector(".admin-skill-list-skill-card__not-found");
        expect(div.textContent).toBe("There are not projects with the React JS skill.");
    });

    it("should activate or desactivate the project list", async () => {
        render(
            <SkillCard
            skill={SKILL_MOCK}
            deleteSkill={() => {}} />
        , container);

        const projectList = container.querySelector(
            ".admin-skill-list-skill-card__project-list"
        );
        expect(projectList.classList.contains(
            "admin-skill-list-skill-card__project-list--active"
        )).toBeFalsy();

        fetchMock.mockOnce(JSON.stringify({
            data: { projects: PROJECTS_MOCK }
        }));

        const span = container.querySelector("span");
        await act(async () => Simulate.click(span));

        expect(projectList.classList.contains(
            "admin-skill-list-skill-card__project-list--active"
        )).toBeTruthy();

        act(() => Simulate.click(span));

        expect(projectList.classList.contains(
            "admin-skill-list-skill-card__project-list--active"
        )).toBeFalsy();
    });

    it("should call delete a project", async () => {
        render(
            <SkillCard
            skill={SKILL_MOCK}
            deleteSkill={() => {}} />
        , container);

        fetchMock.mockOnce(JSON.stringify({
            data: { projects: PROJECTS_MOCK }
        }));

        const span = container.querySelector("span");
        await act(async () => Simulate.click(span));

        fetchMock.mockOnce(JSON.stringify({}));

        const confirmModal = container.querySelector("#confirm-modal-2");
        await act(async () => Simulate.click(confirmModal));

        const fetchCall = fetchMock.mock.calls[1];

        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/projects/2");
        expect(fetchCall[1].method).toBe("DELETE");

        const projectList = container.querySelector(
            ".admin-skill-list-skill-card__project-list"
        );
        expect(projectList.children.length).toBe(2);
    });
});