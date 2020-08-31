import { render } from "react-dom";
import { act } from "react-dom/test-utils";
import Projects from "../Projects";
import { useRouter } from "next/router";

const PROJECTS_MOCK = [
    {
        _id: 1,
        title: "test title",
        images: ["test-1.jpg", "test-2.jpg"]
    },
    {
        _id: 2,
        title: "test title 2",
        images: ["test-21.jpg", "test-22.jpg"]
    }
];

const PROJECT_MOCK = {
    _id: "ID",
    title: "test title",
    images: ["test-1.jpg", "test-2.jpg"],
    skills: []
};

let container;

describe("Domain <Projects/> component", () => {
    beforeEach(() => {
        fetchMock.doMock();
        fetchMock.mockOnce(JSON.stringify({
            data: { projects: PROJECTS_MOCK }
        }));

        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        fetchMock.mockReset();

        document.body.removeChild(container);
        container = null;
    });

    it("should get the projects correclty", async () => {
        await act(async () => {
            render(<Projects/>, container);
        });

        const fetchCall = fetchMock.mock.calls[0];
        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/projects");

        const projects = container.querySelectorAll(".projects-project-card");
        expect(projects.length).toBe(2);
    });

    it("should get the project correclty", async () => {
        useRouter.mockImplementation(() => ({
            query: { project: "ID" }
        }));

        fetchMock.mockOnce(JSON.stringify({
            data: { project: PROJECT_MOCK }
        }));

        await act(async () => {
            render(<Projects/>, container);
        });

        const fetchCall = fetchMock.mock.calls[1];
        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/projects/ID");

        const title = container.querySelector(".projects-view-project__title");
        expect(title.textContent).toBe("test title");
    });
});