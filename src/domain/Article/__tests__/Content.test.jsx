import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import Content from "../Content";

import Quill from "quill";

const CONTENT_MOCK = [
    {
        test: "data",
        other: "data"
    }
];

jest.mock("quill");

let container;

describe("<Content/> component", () => {
    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it("It should configure quill editor correctly", async () => {
        await act(async () => {
            render(<Content content={JSON.stringify(CONTENT_MOCK)}/>, container);
        });

        expect(Quill).toHaveBeenCalledWith("#content-editor", {
            modules: {
                syntax: true,
                toolbar: false
            },
            readOnly: true,
            theme: "snow"
        });
        expect(Quill.prototype.setContents).toHaveBeenCalledWith(CONTENT_MOCK);
    });
});