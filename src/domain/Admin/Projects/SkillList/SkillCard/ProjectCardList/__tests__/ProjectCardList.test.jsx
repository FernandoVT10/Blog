import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import ProjectCardList from "../ProjectCardList";

const PROJECTS_MOCK = [
    {
        _id: 1,
        title: "Test title"
    },
    {
        _id: 2,
        title: "Test title 2"
    },
    {
        _id: 3,
        title: "Test title 3"
    }
];

jest.mock("../ProjectCard", () => {
    return ({ project, deleteProject }) => {
        return (
            <div>
                <span className="test-title">{ project.title }</span>
                <button
                className="test-delete-project"
                onClick={() => deleteProject(project._id)}></button>
            </div>
        );
    };
});

let container;

describe("Domain Projects <ProjectCardList/> component", () => {
    beforeEach(() => {
        fetchMock.doMock();
        fetchMock.mockOnce(JSON.stringify({
            data: {
                projects: PROJECTS_MOCK
            }
        }));

        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        fetchMock.mockReset();

        document.body.removeChild(container);
        container = null;
    });

    it("should call the api and set the data correclty", async () => {
        await act(async () => {
            render(<ProjectCardList skillName="Test" isActive={true}/>, container);
        });

        const fetchCall = fetchMock.mock.calls[0];

        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/projects?skill=Test");

        const projectTitles = container.querySelectorAll("span");
        projectTitles.forEach((title, index) => {
            expect(title.textContent).toBe(PROJECTS_MOCK[index].title);
        });
    });

    it("shouldn't call the api", async () => {
        await act(async () => {
            render(<ProjectCardList skillName="Test" isActive={false}/>, container);
        });

        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("should display a 'there are not projects' message", async () => {
        fetchMock.mockReset();
        fetchMock.doMock();
        fetchMock.mockOnce(JSON.stringify({
            data: { projects: [] }
        }));

        await act(async () => {
            render(<ProjectCardList skillName="Test" isActive={true}/>, container);
        });

        const div = container.querySelector(".admin-skill-list-project-card-list__not-found");

        expect(div.textContent).toBe("There are not projects with the Test skill.");
    });

    it("should delete a project", async () => {
        await act(async () => {
            render(<ProjectCardList skillName="Test" isActive={true}/>, container);
        });

        fetchMock.mockOnce(JSON.stringify({}));

        const buttons = container.querySelectorAll(".test-delete-project");
        await act(async () => Simulate.click(buttons[1]));

        const projectTitles = container.querySelectorAll("span");
        expect(projectTitles.length).toBe(2);

        const fetchCall = fetchMock.mock.calls[1];
        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/projects/2");
        expect(fetchCall[1].method).toBe("DELETE");
    });
});