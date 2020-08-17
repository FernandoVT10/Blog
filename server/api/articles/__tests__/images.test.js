import supertest from "supertest";
import app from "../../../app";

const request = supertest(app);

jest.mock("../../../utils/jwtAuthentication", () => {
    return (_req, _res, next) => next();
});

jest.mock("../../../utils/imageUpload", () => ({
    uploadImage: jest.fn(() => {
        return (req, _res, next) => {
            if(req.body.image) {
                req.file = {
                    filename: req.body.image
                };
            }

            next();
        };
    }),
    uploadImages: () => { return () => {} },
    deleteImage: jest.fn()
}));

describe("Images API", () => {
    describe("Upload Image", () => {
        it("It should get the image name correctly", async () => {
            const res = await request
                .post("/api/articles/uploadImage")
                .send({ image: "test_name.jpg" });

            expect(res.body.data.imageName).toBe("test_name.jpg");
        });

        it("It should get an error", async () => {
            const res = await request.post("/api/articles/uploadImage");

            expect(res.body).toEqual({
                errors: [
                    {
                        status: 200,
                        message: "An error ocurred while trying to upload the image."
                    }
                ]
            });
        });
    });
});