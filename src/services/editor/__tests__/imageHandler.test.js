import imageHandler from "../imageHandler";
import { act } from "react-test-renderer";

const INDEX_MOCK = 7;

const EDITOR_MOCK = {
    getSelection: jest.fn(() => {
        return {
            index: INDEX_MOCK
        };
    }),
    insertEmbed: jest.fn()
};

const IMAGE_MOCK = new File([], "test.jpg", {
    type: "image/png"
});

const INPUT_MOCK = {
    setAttribute: jest.fn(),
    click: jest.fn(),
    files: [IMAGE_MOCK],
    onchange: null
};

describe("Editor ImageHandler", () => {
    beforeEach(() => {
        fetchMock.mockReset();

        INPUT_MOCK.setAttribute.mockClear();
        INPUT_MOCK.click.mockClear();
        INPUT_MOCK.onchange = null;

        EDITOR_MOCK.getSelection.mockClear();
        EDITOR_MOCK.insertEmbed.mockClear();

        jest.spyOn(document, "createElement").mockReturnValueOnce(INPUT_MOCK);
    });

    it("should setup the input file correctly", () => {
        const handler = imageHandler(EDITOR_MOCK);
        handler();

        expect(INPUT_MOCK.setAttribute).toHaveBeenCalledWith("type", "file");
        expect(INPUT_MOCK.click).toHaveBeenCalled();
        expect(INPUT_MOCK.onchange).not.toBeNull();
    });

    it("should send a request to an api with an image file and call insertEmbed", async () => {
        fetchMock.doMock();

        fetchMock.mockOnce(JSON.stringify({
            data: {
                imageName: "test.jpg"
            }
        }));

        const handler = imageHandler(EDITOR_MOCK);
        handler();

        await act(async () => {
            INPUT_MOCK.onchange();
        });

        const fetchCall = fetchMock.mock.calls[0];

        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/articles/uploadImage");

        expect(fetchCall[1].method).toBe("POST");
        expect(fetchCall[1].body.get("image")).toBe(IMAGE_MOCK);
        expect(fetchCall[1].headers).toEqual({ Authorization: "Bearer undefined" });

        expect(EDITOR_MOCK.insertEmbed).toHaveBeenCalledWith(
            INDEX_MOCK, "image", "/img/articles/content/test.jpg"
        );
    });
});