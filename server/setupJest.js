import mongoose from "mongoose";

global.setupTestDB = () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost/test', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
    });

    afterAll(() => {
        mongoose.connection.close();
    });
}