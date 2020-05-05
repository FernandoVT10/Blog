import Modal from "../Modal/";
import { create } from "react-test-renderer";

window.$ = () => ({ on: jest.fn(), modal: jest.fn() });

test("Check if <Modal/> renders correctly", () => {
    const component = create(
        <Modal title="Test modal title" modalSize="modal-xl" prefix="modalTest">
            <p>Test children</p>
        </Modal>
    );

    expect(component.toJSON()).toMatchSnapshot();
});