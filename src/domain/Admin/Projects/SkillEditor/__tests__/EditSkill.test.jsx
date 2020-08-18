import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import EditSkill from "../EditSkill";
import { useRouter } from "next/router";

const SKILL_MOCK = {
    name: "React JS",
    image: "react-js.jpg",
    color: "#aabbcc"
};

const IMAGE_MOCK = { type: "image/jpg" };

URL.createObjectURL = () => "testURL.jpg";

let container;

describe("<EditSkill/> component", () => {
    beforeEach(() => {
        fetchMock.doMock();

        fetchMock.mockOnce(JSON.stringify({
            data: { skill: SKILL_MOCK }
        }));

        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        fetchMock.mockReset();

        document.body.removeChild(container);
        container = null;
    });

    it("should call the api and get the data correctly", async () => {
        await act(async () => {
            render(<EditSkill skillId="ID"/>, container);
        });

        const fetchCall = fetchMock.mock.calls[0];

        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/skills/ID");
    });

    it("should call the api and send the data correctly with image", async () => {
        const routerPushMock = jest.fn();

        useRouter.mockImplementation(() => ({
            push: routerPushMock
        }));

        await act(async () => {
            render(<EditSkill skillId="ID"/>, container);
        });

        const nameInput = container.querySelector("input[type='text']");
        const fileInput = container.querySelector("input[type='file']");
        const colorInput = container.querySelector("input[type='color']");

        act(() => {
            nameInput.value = "test name";
            Simulate.change(nameInput);

            Simulate.change(fileInput, { target: { files: [IMAGE_MOCK] } });

            colorInput.value = "#ffffff";
            Simulate.change(colorInput);
        });

        fetchMock.mockOnce(JSON.stringify({}));

        const button = container.querySelector(".custom-button--save");

        await act(async () => Simulate.click(button));

        const fetchCall = fetchMock.mock.calls[1];

        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/skills/ID");
        expect(fetchCall[1].method).toBe("PUT");
        
        const formData = fetchCall[1].body;

        expect(formData.get("name")).toBe("test name");
        expect(formData.get("image")).not.toBeNull();
        expect(formData.get("color")).toBe("#ffffff");

        expect(routerPushMock).toHaveBeenCalledWith("/admin/projects/");
    });

    it("should call the api and send the data correctly without image", async () => {
        await act(async () => {
            render(<EditSkill skillId="ID"/>, container);
        });

        const nameInput = container.querySelector("input[type='text']");
        const colorInput = container.querySelector("input[type='color']");

        act(() => {
            nameInput.value = "test name";
            Simulate.change(nameInput);

            colorInput.value = "#ffffff";
            Simulate.change(colorInput);
        });

        fetchMock.mockOnce(JSON.stringify({}));

        const button = container.querySelector(".custom-button--save");

        await act(async () => Simulate.click(button));

        const fetchCall = fetchMock.mock.calls[1];

        const formData = fetchCall[1].body;

        expect(formData.get("name")).toBe("test name");
        expect(formData.get("image")).toBeNull();
        expect(formData.get("color")).toBe("#ffffff");
    });

    it("should display an API error", async () => {
        await act(async () => {
            render(<EditSkill skillId="ID"/>, container);
        });

        const nameInput = container.querySelector("input[type='text']");
        const fileInput = container.querySelector("input[type='file']");
        const colorInput = container.querySelector("input[type='color']");

        act(() => {
            nameInput.value = "test name";
            Simulate.change(nameInput);

            Simulate.change(fileInput, { target: { files: [IMAGE_MOCK] } });

            colorInput.value = "#ffffff";
            Simulate.change(colorInput);
        });

        fetchMock.mockOnce(JSON.stringify({
            errors: [
                { message: "This is an API error" }
            ]
        }));

        const button = container.querySelector(".custom-button--save");

        await act(async () => Simulate.click(button));

        const p = container.querySelector("p");

        expect(p.textContent).toBe("This is an API error");
    });

    it("should display the name is required error message", async () => {
        await act(async () => {
            render(<EditSkill skillId="ID"/>, container);
        });

        const nameInput = container.querySelector("input[type='text']");

        act(() => {
            nameInput.value = "";
            Simulate.change(nameInput);
        });

        const button = container.querySelector(".custom-button--save");

        act(() => Simulate.click(button));

        const p = container.querySelector("p");

        expect(p.textContent).toBe("The name is required");
    });
});