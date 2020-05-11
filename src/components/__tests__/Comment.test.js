import { create } from "react-test-renderer";
import Comment from "../Comment/Comment";

const COMMENT_MOCK = {
    name: "Test name",
    comment: "This is a test"
};

test("Check if <Comments/> renders correctly", () => {
    const component = create(<Comment comment={COMMENT_MOCK}/>);

    expect(component.toJSON()).toMatchSnapshot();
});