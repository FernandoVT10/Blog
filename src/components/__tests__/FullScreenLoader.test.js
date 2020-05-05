import { create } from "react-test-renderer";
import FullScreenLoader from "../FullScreenLoader/";

test("Check if <FullScreenLoader/> renders correctly", () => {
    const component = create(<FullScreenLoader loading={true} text="Test text" />);

    expect(component.toJSON()).toMatchSnapshot();
});