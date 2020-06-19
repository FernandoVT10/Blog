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

describe("ImageHandler", () => {
    beforeEach(() => {
        fetchMock.mockReset();

        INPUT_MOCK.setAttribute.mockClear();
        INPUT_MOCK.click.mockClear();
        INPUT_MOCK.onchange = null;

        EDITOR_MOCK.getSelection.mockClear();
        EDITOR_MOCK.insertEmbed.mockClear();

        jest.spyOn(document, "createElement").mockReturnValueOnce(INPUT_MOCK);
    });

    it("It should setup the input file correctly", () => {
        const handler = imageHandler(EDITOR_MOCK);
        handler();

        expect(INPUT_MOCK.setAttribute).toHaveBeenCalledWith("type", "file");
        expect(INPUT_MOCK.click).toHaveBeenCalled();
        expect(INPUT_MOCK.onchange).not.toBeNull();
    });

    it("It should send a request to an api with an image file and call insertEmbed", async () => {
        fetchMock.doMock();

        fetchMock.mockOnce(JSON.stringify({
            status: true,
            imageName: "test.jpg"
        }));

        const handler = imageHandler(EDITOR_MOCK);
        handler();

        await act(async () => {
            INPUT_MOCK.onchange();
        });

        const fetchCall = fetchMock.mock.calls[0];
        const fetchBody = fetchCall[1].body;

        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/images/uploadImage");
        expect(fetchBody.get("image")).toBe(IMAGE_MOCK);
        expect(EDITOR_MOCK.insertEmbed).toHaveBeenCalledWith(
            INDEX_MOCK,
            "image",
            WEBSITE_URL + "img/articles/content/test.jpg"
        );
    });
});