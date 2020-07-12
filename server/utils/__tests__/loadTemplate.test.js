import loadTemplate from "../loadTemplate";
import fs from "fs";
import path from "path";

jest.mock("fs");

describe("Load Template", () => {
    beforeEach(() => {
        fs.readFileSync.mockReset();
    });

    it("It hsould load a template", () => {
        fs.readFileSync.mockImplementation(() => {
            return { toString: () => "This is a {param1}{param2}" }
        });

        const template = loadTemplate("test", {
            param1: "Super",
            param2: "Test"
        });

        const url = path.join(__dirname, "../../templates/test.html");

        expect(template).toBe("This is a SuperTest");
        expect(fs.readFileSync).toHaveBeenCalledWith(url);
    });
});