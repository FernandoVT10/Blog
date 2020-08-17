import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import SkillList from "../SkillList";

const SKILLS_MOCK = [
    { name: "React JS" },
    { name: "Node JS" },
    { name: "GraphQL" }
];

let container;

describe("<SkillList/> component", () => {
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
            render(
                <SkillList
                skills={[]} 
                setSkills={() => {}}/>
            , container);
        });

        const fetchCall = fetchMock.mock.calls[0];

        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/skills");

        const skillLabels = container.querySelectorAll("label");

        expect(skillLabels[0].textContent).toBe("React JS");
        expect(skillLabels[1].textContent).toBe("Node JS");
        expect(skillLabels[2].textContent).toBe("GraphQL");
    });

    it("should activate the skills included in the skills prop", async () => {
        await act(async () => {
            render(
                <SkillList
                skills={["GraphQL"]} 
                setSkills={() => {}}/>
            , container);
        });

        const skillCheckbox = container.querySelector("#skill-GraphQL");
        
        expect(skillCheckbox.checked).toBeTruthy();
    });

    it("should call 'setSkill' when we click a checkbox", async () => {
        const setSkillsMock = jest.fn();

        await act(async () => {
            render(
                <SkillList
                skills={["GraphQL"]} 
                setSkills={setSkillsMock}/>
            , container);
        });

        const reactJSCheckbox = container.querySelector("input[id='skill-React JS']");

        act(() => Simulate.change(reactJSCheckbox));

        const skills = setSkillsMock.mock.calls[0][0](["GraphQL"]);
        
        expect(skills).toEqual(["GraphQL", "React JS"]);
        expect(reactJSCheckbox.checked).toBeTruthy();

        setSkillsMock.mockReset();

        act(() => {
            render(
                <SkillList
                skills={["GraphQL", "React JS"]} 
                setSkills={setSkillsMock}/>
            , container);
        });

        const graphQLCheckbox = container.querySelector("#skill-GraphQL");

        act(() => Simulate.change(graphQLCheckbox));
        
        expect(setSkillsMock).toHaveBeenCalledWith(["React JS"]);
        expect(graphQLCheckbox.checked).toBeFalsy();
    });

    it("should activate or desactivate the container", async () => {
        await act(async () => {
            render(
                <SkillList
                skills={["GraphQL"]} 
                setSkills={() => {}}/>
            , container);
        });

        const skillList = container.querySelector(".project-editor-skill-list__container");
        const button = container.querySelector("button");

        expect(
            skillList.classList.contains("project-editor-skill-list__container--active")
        ).toBeFalsy();

        act(() => Simulate.click(button));

        expect(
            skillList.classList.contains("project-editor-skill-list__container--active")
        ).toBeTruthy();

        act(() => Simulate.click(button));

        expect(
            skillList.classList.contains("project-editor-skill-list__container--active")
        ).toBeFalsy();
    });
});