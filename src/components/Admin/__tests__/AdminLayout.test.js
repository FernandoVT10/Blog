import { create } from "react-test-renderer";
import AdminLayout from "../AdminLayout/AdminLayout";

test("Check if <AdminLayout/> renders correctly", () => {
    const component = create(<AdminLayout/>);

    expect(component.toJSON()).toMatchSnapshot();
});