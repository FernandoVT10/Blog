import separateThousands from "../separateThousands";

describe("Separate Thousands", () => {
    it("should get a string", () => {
        expect(separateThousands(593242304)).toBe("593 242 304");
    });

    it("shouldn't get an error when we send a string how parameter", () => {
        expect(separateThousands("3956732")).toBe("3 956 732");
    });
});