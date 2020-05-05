import { create } from "react-test-renderer";
import Loader from "../Loader/";

test("Check if <Loader/> renders correctly", () => {
    const component = create(<Loader active={true} />);

    expect(component.toJSON()).toMatchSnapshot();
});