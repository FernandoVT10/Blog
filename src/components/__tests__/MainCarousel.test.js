import MainCarousel from "../MainCarousel/";
import { create } from "react-test-renderer";

test("Check if <MainCarousel/> renders correctly", () => {
    const component = create(<MainCarousel/>);

    expect(component.toJSON()).toMatchSnapshot();
});