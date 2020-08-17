import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import EditProject from "../EditProject";
import { useRouter } from "next/router";

const SKILLS_MOCK = [
    { name: "React JS" },
    { name: "Node JS" },
    { name: "GraphQL" }
];

const PROJECT_MOCK = {
    title: "Project",
    description: "Project description",
    images: ["test-1.jpg", "test-2.jpg"],
    skills: [{ name: "React JS" }, { name: "Node JS" }]
};

const IMAGE_MOCK = {
    type: "image/jpg",
    name: "test.jpg"
};

URL.createObjectURL = () => "testURL.jpg";

let container;

describe("<EditProject/> component", () => {
    beforeEach(() => {
        fetchMock.doMock();

        fetchMock
        .once(JSON.stringify({
            data: { project: PROJECT_MOCK }
        }))
        .once(JSON.stringify({
            data: { skills: SKILLS_MOCK }
        }));

        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it("should call the api and send the data correclty", async () => {
        const routerPushMock = jest.fn();

        useRouter.mockImplementation(() => ({
            push: routerPushMock
        }));

        await act(async () => {
            render(<EditProject projectId="ID"/>, container);
        });

        const input = container.querySelector(".project-editor__input");
        const inputFile = container.querySelector(".project-editor-carousel__input-file");
        const textarea = container.querySelector(".project-editor__textarea");
        const nodeJSCheckbox = container.querySelector("input[id='skill-Node JS']");

        act(() => {
            input.value = "test title";
            Simulate.change(input);

            Simulate.change(inputFile, { target: { files: [IMAGE_MOCK] } });

            textarea.value = "test description";
            Simulate.change(textarea);

            Simulate.change(nodeJSCheckbox);
        });

        fetchMock.mockOnce(JSON.stringify({ data: {} }));

        const button = container.querySelector(".custom-button--save");

        await act(async () => Simulate.click(button));

        expect(routerPushMock).toHaveBeenCalledWith("/admin/projects/");

        const fetchCall = fetchMock.mock.calls[2];

        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/projects/ID");
        expect(fetchCall[1].method).toBe("PUT");

        const formData = fetchCall[1].body;

        expect(formData.get("title")).toBe("test title");

        expect(formData.getAll("currentImages")).toEqual(["test-1.jpg", "test-2.jpg"]);
        expect(formData.getAll("newImages")).not.toBeNull();

        expect(formData.get("description")).toBe("test description");
        expect(formData.getAll("skills")).toEqual(["React JS"]);
    });

    it("should display an error", async () => {
        await act(async () => {
            render(<EditProject/>, container);
        });

        const input = container.querySelector(".project-editor__input");
        const textarea = container.querySelector(".project-editor__textarea");

        act(() => {
            input.value = "test title";
            Simulate.change(input);

            textarea.value = "test description";
            Simulate.change(textarea);
        });

        fetchMock.mockOnce(JSON.stringify({
            errors: [
                { message: "API error" }
            ]
        }));

        const button = container.querySelector(".custom-button--save");

        await act(async () => Simulate.click(button));

        const p = container.querySelector("p");

        expect(p.textContent).toBe("API error");
    });
});