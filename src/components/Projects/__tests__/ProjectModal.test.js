import ProjectModal from "../ProjectModal/";
import { act } from "react-dom/test-utils";
import { render } from "react-dom";
import { useRouter } from "next/router";

const PROJECT_MOCK = {
    _id: 123,
    title: "Test title",
    description: "This is a test description",
    skills: [
        {
            _id: 21,
            name: "React JS"
        },
        {
            _id: 22,
            name: "Node JS"
        }
    ],
    images: ["test-image-1.jpg", "test-image-2.jpg", "test-image-3.jpg"]
};

useRouter.mockImplementation(jest.fn(() => {
    return {
        query: { project: "123456" }
    };
}));

let container;

describe("<ProjectModal/> component", () => {
    beforeEach(() => {
        fetchMock.doMock();

        fetchMock.mockOnce(JSON.stringify(
            PROJECT_MOCK
        ));

        container = document.createElement('div');
        document.body.appendChild(container);
    });
    
    afterEach(() => {
        fetchMock.mockReset();

        document.body.removeChild(container);
        container = null;
    });

    it("It should call the api to get the project", async () => {
        await act(async () => {
            render(<ProjectModal />, container);
        });

        const fetchCall = fetchMock.mock.calls[0];

        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/projects/getProjectById/123456");
    });

    it("It should call the api only once when we change the router.query", async () => {
        await act(async () => {
            render(<ProjectModal />, container);
        });

        useRouter.mockImplementation(jest.fn(() => {
            return {
                query: { project: "123456", other: "change" }
            };
        }));

        await act(async () => {
            render(<ProjectModal />, container);
        });

        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("It should call router.push when we close the modal", async () => {
        const routerPush = jest.fn();

        useRouter.mockImplementation(() => ({
            query: { project: "123456" },
            pathname: "/",
            push: routerPush
        }));

        let callbackMock = null;

        window.$ = jest.fn(() => ({
            on: (_, cb) => {
                callbackMock = cb;
            },
            modal: jest.fn()
        }));

        Object.defineProperty(window, 'location', {
            value: {
                search: "?skill=Test-skill"
            }
        });

        await act(async () => {
            render(<ProjectModal />, container);
        });

        act(() => {
            callbackMock();
        });

        expect(routerPush).toHaveBeenCalledWith({
            pathname: "/",
            query: { skill: "Test-skill" }
        });
    });

    it("It should open the modal without calling the api and without changing the 'project' query parameter", async () => {
        await act(async () => {
            render(<ProjectModal />, container);
        });

        useRouter.mockImplementation(jest.fn(() => {
            return {
                query: {}
            };
        }));

        await act(async () => {
            render(<ProjectModal />, container);
        });

        fetchMock.mockReset();

        const modalMock = jest.fn();

        window.$ = jest.fn(() => ({
            on: jest.fn(),
            modal: modalMock
        }));

        useRouter.mockImplementation(jest.fn(() => {
            return {
                query: { project: "123456", other: "change" }
            };
        }));

        await act(async () => {
            render(<ProjectModal />, container);
        });

        expect(fetchMock).not.toHaveBeenCalled();
        expect(modalMock).toHaveBeenCalledWith("show");
    });

    it("It should close the modal when we remove the 'project' query paramter", async () => {
        await act(async () => {
            render(<ProjectModal />, container);
        });

        useRouter.mockImplementation(jest.fn(() => {
            return {
                query: {}
            };
        }));

        const modalMock = jest.fn();

        window.$ = jest.fn(() => ({
            on: jest.fn(),
            modal: modalMock
        }));

        await act(async () => {
            render(<ProjectModal />, container);
        });

        expect(modalMock).toHaveBeenCalledWith("hide");
    });
});