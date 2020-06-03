import { useEffect } from "react";

import "./ConfirmModal.scss";

export default ({ active, message, onClose, prefix="" }) => {
    useEffect(() => {
        if(active) {
            $(`#${prefix}-confirm-modal`).modal('show');
        } else {
            $(`#${prefix}-confirm-modal`).modal('hide');
        }
    }, [active]);

    return (
        <div
        className="modal confirm-modal fade"
        tabIndex="-1"
        role="dialog"
        id={`${prefix}-confirm-modal`}>
            <div className="modal-dialog" role="document">
                <div className="modal-content confirm-modal__content">
                    <div className="modal-body">
                        <h5 className="confirm-modal__message">
                            { message }
                        </h5>

                        <button
                        type="button"
                        className="confirm-modal__button confirm-modal__button--close"
                        data-dismiss="modal"
                        aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>

                        <button
                        className="confirm-modal__button confirm-modal__button--yes"
                        data-dismiss="modal"
                        onClick={() => onClose(true)}>
                            Yes
                        </button>

                        <button
                        className="confirm-modal__button confirm-modal__button--no"
                        data-dismiss="modal"
                        onClick={() => onClose(false)}>
                            No
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};