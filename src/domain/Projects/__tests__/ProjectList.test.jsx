import ProjectList from "../ProjectList";
import { render } from "react-dom";

let container;

describe("Domain Projects <ProjectList/> component", () => {
    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it("should display a loading screen", () => {
        render(<ProjectList projects={[]} loading={true}/>, container);

        expect(container.querySelector(".spinner-border")).not.toBeNull();
    });

    it("should display a not available projects screen", () => {
        render(<ProjectList projects={[]}/>, container);

        expect(
            container.querySelector(".projects-project-list__container").textContent
        ).toBe("There are no projects available.");
    });
});