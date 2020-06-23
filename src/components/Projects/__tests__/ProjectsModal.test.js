import ProjectsModal from "../ProjectsModal/";
import { act } from "react-dom/test-utils";
import { render } from "react-dom";
import { useRouter } from "next/router";

const PROJECTS_MOCK = [
    {
        _id: 123,
        title: "Test title",
        images: ["test-image-1.jpg", "test-image-2.jpg", "test-image-3.jpg"]
    },
    {
        _id: 124,
        title: "Test title 2",
        images: ["test-image-1.jpg", "test-image-2.jpg", "test-image-3.jpg"]
    },
    {
        _id: 125,
        title: "Test title 3",
        images: ["test-image-1.jpg", "test-image-2.jpg", "test-image-3.jpg"]
    }
];

useRouter.mockImplementation(jest.fn(() => ({ query: { skill: "React JS" } })));

const modalMock = jest.fn();

let container, callbackMock;

window.$ = jest.fn(() => ({
    on: (_, cb) => {
        callbackMock = cb;
    },
    modal: modalMock
}));

describe("<ProjectsModal/> component", () => {
    beforeEach(() => {
        fetchMock.doMock();

        fetchMock.mockOnce(JSON.stringify(
            PROJECTS_MOCK
        ));

        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        fetchMock.mockReset();
        modalMock.mockReset();

        document.body.removeChild(container);
        container = null;
        callbackMock = null;
    });

    it("It should call the api to get the projects and open the modal", async () => {
        await act(async () => {
            render(<ProjectsModal/>, container);
        });

        const fetchCall = fetchMock.mock.calls[0];

        expect(fetchCall[0]).toBe(
            WEBSITE_URL + "api/projects/getProjectsBySkillName/React JS"
        );
        expect(modalMock).toHaveBeenCalledWith("show");
    });

    it("It should open the modal without changing the 'skill' query parameter", async () => {
        await act(async () => {
            render(<ProjectsModal/>, container);
        });

        fetchMock.mockReset();

        useRouter.mockImplementation(jest.fn(() => {
            return {
                query: { skill: "React JS", other: "change" }
            };
        }));

        await act(async () => {
            render(<ProjectsModal/>, container);
        });

        expect(fetchMock).not.toHaveBeenCalled();
        expect(modalMock).toHaveBeenCalledWith("show");
    });

    it("It should close the modal when we put the 'project' parameter", async () => {
        await act(async () => {
            render(<ProjectsModal/>, container);
        });

        useRouter.mockImplementation(jest.fn(() => {
            return {
                query: { skill: "React JS", project: "123456" }
            };
        }));

        await act(async () => {
            render(<ProjectsModal/>, container);
        });

        expect(modalMock).toHaveBeenCalledWith("hide");
    });

    it("It should close the modal when we remove the 'skill' parameter", async () => {
        await act(async () => {
            render(<ProjectsModal/>, container);
        });

        useRouter.mockImplementation(jest.fn(() => {
            return {
                query: { other: "Test" }
            };
        }));

        await act(async () => {
            render(<ProjectsModal/>, container);
        });

        expect(modalMock).toHaveBeenCalledWith("hide");
    });

    it("It should remove all paremters from the router.query", async () => {
        const routerPush = jest.fn();

        useRouter.mockImplementation(() => ({
            query: { skill: "123456" },
            pathname: "/",
            push: routerPush
        }));

        await act(async () => {
            render(<ProjectsModal/>, container);
        });

        act(() => {
            callbackMock();
        });

        expect(routerPush).toHaveBeenCalledWith({
            pathname: "/",
            query: {}
        });
    });

    it("It should add the 'modal-open' class to the body when we add the 'project' query parameter", async () => {
        useRouter.mockImplementation(jest.fn(() => {
            return {
                query: { skill: "React JS", project: "123456" }
            };
        }));

        await act(async () => {
            render(<ProjectsModal/>, container);
        });

        act(() => {
            callbackMock();
        });

        expect(document.body.classList.contains("modal-open")).toBeTruthy();
    });
});