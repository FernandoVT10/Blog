import Navbar from "../Navbar/Navbar";
import { create } from "react-test-renderer";

test("Check if <Navbar/> renders correctly", () => {
    const component = create(<Navbar/>);

    expect(component.toJSON()).toMatchSnapshot();
});