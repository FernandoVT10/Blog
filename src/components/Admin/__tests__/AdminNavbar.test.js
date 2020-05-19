import { act, Simulate } from "react-dom/test-utils";
import { render } from "react-dom";
import AdminNavbar from "../AdminNavbar/";

let container;

describe('<AdminNavbar/> Component', () => {
    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });
    
    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it('Check if renders correctly', () => {
        render(<AdminNavbar/>, container);

        expect(container).toMatchSnapshot();
    });

    it("It should add the navbar--active class", async () => {
        render(<AdminNavbar/>, container);

        const nav = container.querySelector("nav");
        const button = container.querySelector(".admin-navbar__item-icon");

        expect(nav.classList.contains("admin-navbar--active")).toBeFalsy();

        act(() => {
            Simulate.click(button);
        });

        expect(nav.classList.contains("admin-navbar--active")).toBeTruthy();
    });
});