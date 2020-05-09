import Modal from "../Modal/";
import { create } from "react-test-renderer";

test("Check if <Modal/> renders correctly", () => {
    const component = create(
        <Modal title="Test modal title" modalSize="modal-xl" prefix="modalTest">
            <p>Test children</p>
        </Modal>
    );

    expect(component.toJSON()).toMatchSnapshot();
});