import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import Projects from "../Projects";
import { useRouter } from "next/router";

let container;

describe("Domain Admin <Projects/> component", () => {
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

    it("should render <AddProject/>", async () => {
        useRouter.mockImplementation(() => ({
            query: {
                options: ["addProject"]
            }
        }));

        fetchMock.mockOnce(JSON.stringify({
            data: {
                skills: []
            }
        }));

        await act(async () => {
            render(<Projects/>, container);
        });

        expect(container.querySelector("#add-project-modal")).not.toBeNull();
    });

    it("should render <AddSkill/>", async () => {
        useRouter.mockImplementation(() => ({
            query: {
                options: ["addSkill"]
            }
        }));

        fetchMock.mockOnce(JSON.stringify({
            data: {
                skills: []
            }
        }));

        await act(async () => {
            render(<Projects/>, container);
        });

        expect(container.querySelector("#add-skill-modal")).not.toBeNull();
    });

    it("should render <EditProject/>", async () => {
        useRouter.mockImplementation(() => ({
            query: {
                options: ["ID", "edit"]
            }
        }));

        fetchMock
        .once(JSON.stringify({}))
        .once(JSON.stringify({
            data: {
                skills: []
            }
        }));

        await act(async () => {
            render(<Projects/>, container);
        });

        const fetchCall = fetchMock.mock.calls[0];
        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/projects/ID");

        expect(container.querySelector("#edit-project-modal")).not.toBeNull();
    });

    it("should render <EditSkill/>", async () => {
        useRouter.mockImplementation(() => ({
            query: {
                options: ["ID", "editSkill"]
            }
        }));

        fetchMock
        .once(JSON.stringify({}))
        .once(JSON.stringify({}));

        await act(async () => {
            render(<Projects/>, container);
        });

        const fetchCall = fetchMock.mock.calls[0];
        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/skills/ID");

        expect(container.querySelector("#edit-skill-modal")).not.toBeNull();
    });
});