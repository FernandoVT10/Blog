import { render } from "react-dom";
import { act } from "react-dom/test-utils";
import ViewProject from "../ViewProject";

let container;

describe("Domain Projects <ViewProject/> component", () => {
    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it("should render a loading screen", () => {
        render(<ViewProject project={{}} loading={true}/>, container);

        expect(container.querySelector(".spinner-border")).not.toBeNull();
    });

    it("should render a project doesn't exist screen", () => {
        render(<ViewProject project={{}} loading={false}/>, container);

        expect(
            container.querySelector(".projects-view-project__container").textContent
        ).toBe("The project doesn't exist.");
    });

    it("should set the project data", () => {
        const project = {
            title: "Test title",
            description: "Test description",
            images: ["test1.jpg", "test2.jpg"],
            skills: [
                { _id: 1, name: "Test skill" }
            ]
        };

        render(<ViewProject project={project}/>, container);

        const title = container.querySelector(".projects-view-project__title");
        const description = container.querySelector(".projects-view-project__description");
        const skill = container.querySelector(".projects-view-project__skill");

        expect(title.textContent).toBe("Test title");
        expect(description.textContent).toBe("Test description");
        expect(skill.textContent).toBe("Test skill");
        expect(container.querySelectorAll(".projects-project-carousel__image").length).toBe(2);
    });
});