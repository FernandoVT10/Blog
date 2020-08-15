import { useEffect } from "react";

import "./Modal.scss";

export default ({ children, title, active = false, onClose, prefix = "" }) => {
    useEffect(() => {
        $(`#${prefix}-modal`).on("hidden.bs.modal", () => {
            onClose();
        });
    }, []);
    
    useEffect(() => {
        if(active) {
            $(`#${prefix}-modal`).modal("show");
        } else {
            $(`#${prefix}-modal`).modal("hide");
        }
    }, [active]);
    
    return (
        <div className="modal fade" tabIndex="-1" role="dialog" id={`${prefix}-modal`}>
            <div className="modal-dialog modal-xl" role="document">
                <div className="modal-content modal__content">
                    <div className="modal-header modal__header">
                        <h2 className="modal__title">{ title }</h2>

                        <button
                        type="button"
                        className="close modal__close-button"
                        data-dismiss="modal"
                        aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body modal__body">
                        { children }
                    </div>
                </div>
            </div>
        </div>
    );
};