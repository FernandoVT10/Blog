import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import SkillList from "../SkillList";
import { useRouter } from "next/router";

const SKILLS_MOCK = [
    {
        _id: 1,
        name: "Node JS"
    },
    {
        _id: 2,
        name: "React JS"
    },
    {
        _id: 3,
        name: "GraphQL"
    }
];

jest.mock("next/link", () => {
    return ({ children }) => {
        return children;
    }
});

jest.mock("../SkillCard", () => {
    return ({ skill, deleteSkill, updateSkillName }) => {
        return (
            <div className="test-skills">
                <button
                id={`delete-button-${skill._id}`}
                onClick={() => deleteSkill(skill._id)}></button>

                <button
                id={`update-button-${skill._id}`}
                onClick={() => updateSkillName(skill._id, skill.name)}></button>
            </div>
        );
    }
});

let container;

describe("Domain Projects <SkillList/> component", () => {
    beforeEach(() => {
        fetchMock.doMock();
        fetchMock.mockOnce(JSON.stringify({
            data: { skills: SKILLS_MOCK }
        }));

        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        fetchMock.mockReset();
        
        document.body.removeChild(container);
        container = null;
    });

    it("should call the api and set the data correctly", async () => {
        await act(async () => {
            render(<SkillList/>, container); 
        });

        const fetchCall = fetchMock.mock.calls[0];

        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/skills");

        const skillCardList = container.querySelectorAll(".test-skills");
        expect(skillCardList.length).toBe(3);
    });

    it("should display a 'no skills available' message", async () => {
        fetchMock.mockReset();
        fetchMock.doMock();
        fetchMock.mockOnce(JSON.stringify({
            data: { skills: [] }
        }));

        await act(async () => {
            render(<SkillList/>, container); 
        });

        const div = container.querySelector(".custom-table__not-found");
        expect(div.textContent).toBe("No skills available.");
    });

    it("should delete a skill", async () => {
        await act(async () => {
            render(<SkillList/>, container); 
        });

        fetchMock.mockOnce(JSON.stringify({}));

        const deleteButton = container.querySelector("#delete-button-2");
        await act(async () => Simulate.click(deleteButton));

        const fetchCall = fetchMock.mock.calls[1];

        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/skills/2");
        expect(fetchCall[1].method).toBe("DELETE");

        const skillCardList = container.querySelectorAll(".test-skills");
        expect(skillCardList.length).toBe(2);
    });

    it("should update skill name of a skill", async () => {
        await act(async () => {
            render(<SkillList/>, container); 
        });

        fetchMock.mockOnce(JSON.stringify({}));

        const updateButton = container.querySelector("#update-button-2");
        await act(async () => Simulate.click(updateButton));

        const fetchCall = fetchMock.mock.calls[1];

        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/skills/2");
        expect(fetchCall[1].body).toBe(JSON.stringify({ name: "React JS" }));
        expect(fetchCall[1].method).toBe("PUT");
    });

    it("should call router.push", async () => {
        const routerPushMock = jest.fn();

        useRouter.mockImplementation(() => ({
            pathname: "/",
            push: routerPushMock
        }));

        await act(async () => {
            render(<SkillList/>, container); 
        });

        const addNewButtons = container.querySelectorAll(".admin-skill-list__add-new-menu-item");

        act(() => Simulate.click(addNewButtons[0]));
        expect(routerPushMock).toHaveBeenCalledWith("/", "/admin/projects/addProject");

        expect(routerPushMock).toHaveBeenCalledTimes(1);
    });
});