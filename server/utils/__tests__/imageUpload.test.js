import { uploadImage, deleteImage } from "../imageUpload";
import { unlinkSync } from "fs";
import multer from "multer";

jest.mock("multer");
jest.mock("../../config/constants", () => ({
    IMAGES_URL: "images"
}));

jest.mock("fs");

describe("Image Upload", () => {
    beforeAll(() => {
        multer.diskStorage.mockReset();
        unlinkSync.mockReset();
    });

    describe("Upload image", () => {
        it("It should initialize multer correctly", () => {
            uploadImage("test", "/test/");

            const diskStorageCalls = multer.diskStorage.mock.calls;

            const callbackMock = jest.fn();
            diskStorageCalls[0][0].destination(null, null, callbackMock);
            expect(callbackMock).toHaveBeenCalledWith(null, "images/test/");

            callbackMock.mockReset();

            diskStorageCalls[0][0].filename(null, null, callbackMock);
            expect(callbackMock).toHaveBeenCalledWith(null, expect.any(String));

            const filename = callbackMock.mock.calls[0][1];
            expect(/.\.jpg/.test(filename)).toBeTruthy();
        });

        it("It should get a error", () => {
            const response = uploadImage("test", "/test/");

            multer.mockImplementation(jest.fn(({ fileFilter }) => {
                return {
                    single: () => {
                        return (req, _res, cb) => {
                            fileFilter(req, req.file, cb);
                        };
                    }
                };
            }));

            const jsonMock = jest.fn();

            const req = {
                file: { mimetype: "j" }
            };

            const res = { json: jsonMock };

            response(req, res, jest.fn());

            expect(jsonMock).toHaveBeenCalledWith({
                errors: [
                    {
                        status: 200,
                        message: `The test must be an image`
                    }
                ]
            });
        });

        it("It should call next function", () => {
            const response = uploadImage("test", "/test/");

            multer.mockImplementation(jest.fn(({ fileFilter }) => {
                return {
                    single: () => {
                        return (req, _res, cb) => {
                            fileFilter(req, req.file, cb);
                        };
                    }
                };
            }));

            const nextMock = jest.fn();

            const req = {
                file: { mimetype: "image/png" }
            };

            response(req, null, nextMock);

            expect(nextMock).toHaveBeenCalled();
        });
    });

    it("It should call unlinkSync", () => {
        deleteImage("/test/image.jpg");

        expect(unlinkSync).toBeCalledWith("images/test/image.jpg");
    });
});