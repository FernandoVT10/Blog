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

jest.mock("../../../../../components/ConfirmModal", () => {
    return ({ message, prefix, onClose }) => {
        return (
            <span id={`confirm-modal-${prefix}`} onClick={() => onClose(true)}>
                { message }
            </span>
        );
    }
});

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
            render(<SkillList/>, container); 
        });

        const fetchCall = fetchMock.mock.calls[0];

        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/skills");

        const skillCardList = container.querySelector(".custom-table__body");

        expect(skillCardList.children.length).toBe(3);
    });

    it("should delete a skill", async () => {
        await act(async () => {
            render(<SkillList/>, container); 
        });

        fetchMock.mockOnce(JSON.stringify({}));

        const confirmModal = container.querySelector("#confirm-modal-2");
        await act(async () => Simulate.click(confirmModal));

        const fetchCall = fetchMock.mock.calls[1];
        // console.log(fetchMock.mock.calls[3]);

        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/skills/2");
        expect(fetchCall[1].method).toBe("DELETE");

        const skillCardList = container.querySelector(".custom-table__body");
        expect(skillCardList.children.length).toBe(2);
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

        act(() => Simulate.click(addNewButtons[1]));
        expect(routerPushMock).toHaveBeenCalledWith("/", "/admin/projects/addSkill");

        expect(routerPushMock).toHaveBeenCalledTimes(2);
    });
});