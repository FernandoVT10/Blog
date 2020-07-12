import Comment from "../../../models/Comment";
import Article from "../../../models/Article";
import supertest from "supertest";
import app from "../../../app";

const request = supertest(app);

const COMMENT_MOCKS = [
    {
        name: "Test name",
        comment: "Test comment",
        createdAt: Date.now() + 2
    },
    {
        name: "Test name 2",
        comment: "Test comment 2",
        createdAt: Date.now() + 1
    },
    {
        name: "Test name 3",
        comment: "Test comment 3",
        createdAt: Date.now()
    }
];

const ARTICLE_MOCK = {
    title: "Test Article",
    description: "Test description",
    cover: "cover.jpg",
    content: "Test content",
    categories: [],
    createdAt: Date.now() + 2
};

setupTestDB("test_comments");

let article;

describe("comments api", () => {
    beforeEach(async () => {
        article = await Article.create(ARTICLE_MOCK);

        for(const { name, comment, createdAt } of COMMENT_MOCKS) {
            await Comment.create({
                articleId: article._id,
                name,
                comment,
                createdAt
            });
        }
    });

    afterEach(() => {
        article = null;
    });

    describe("Get Comments", () => {
        it("it should get the all comments", async () => {
            const res = await request.get(`/api/articles/${article._id}/comments`);
            const { comments } = res.body.data;

            comments.forEach(({ name, comment }, index) => {
                expect(name).toBe(COMMENT_MOCKS[index].name);
                expect(comment).toBe(COMMENT_MOCKS[index].comment);
            });
        });

        it("it should get the second comment", async () => {
            const res = await request
                .get(`/api/articles/${article._id}/comments`)
                .query({ offset: 1, limit: 1 });

            const { comments } = res.body.data;

            expect(comments[0].name).toBe("Test name 2");
            expect(comments[0].comment).toBe("Test comment 2");
        });

        it("it should get an empty array", async () => {
            const res = await request.get(`/api/articles/abcefabcefabcefabcefabce/comments`);
            const { comments } = res.body.data;

            expect(comments).toEqual([]);
        });
    });

    describe("Add Comment", () => {
        it("It should get a 404 error", async () => {
            const res = await request
                .post(`/api/articles/abcefabcefabcefabcefabce/comments`)
                .send({
                    name: "Test name",
                    comment: "Test comment"
                });

            expect(res.body).toEqual({
                errors: [
                    {
                        status: 404,
                        message: "The article doesn't exist"
                    }
                ]
            });
        });

        it("It should get a max character error in the name", async () => {
            const res = await request
                .post(`/api/articles/${article._id}/comments`)
                .send({
                    name: "Test name with more of 30 characters",
                    comment: "Test comment"
                });

            const { errors } = res.body;

            expect(errors).toMatchSnapshot();
        });

        it("It should get a max character error in the comment", async () => {
            const comment = randomText(501);

            const res = await request
                .post(`/api/articles/${article._id}/comments`)
                .send({
                    name: "Test name",
                    comment
                });

            const { errors } = res.body;

            expect(errors[0].message)
            .toBe(`comments validation failed: comment: Path \`comment\` (\`${comment}\`) is longer than the maximum allowed length (500).`);
        });

        it("It should create a comment", async () => {
            const comment = randomText(250);

            const res = await request
                .post(`/api/articles/${article._id}/comments`)
                .send({
                    name: "Test name #21",
                    comment
                });

            const { createdComment } = res.body.data;

            expect(createdComment.name).toBe("Test name #21");
            expect(createdComment.comment).toBe(comment);
        });
    });
});