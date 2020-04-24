import { useEffect, useState } from "react";

import "./Modal.scss";

export default ({ children, title, active = false, prefix = "" }) => {
    useEffect(() => {
        if(active) {
            $(`#${prefix}-modal`).modal('show');
        } else {
            $(`#${prefix}-modal`).modal('hide');
        }
    }, [active]);
    
    return (
        <div className="modal fade" tabIndex="-1" role="dialog" id={`${prefix}-modal`}>
            <div className="modal-dialog" role="document">
                <div className="modal-content modal__content">
                    <div className="modal-header modal__header">
                        <h5 className="modal__title">{ title }</h5>

                        <button
                        type="button"
                        className="close modal__button"
                        data-dismiss="modal"
                        aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body modal__body">
                        { children }
                    </div>
                    {/* <div className="modal-footer modal__footer">
                        <button type="button" className="btn btn-primary">Save changes</button>
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div> */}
                </div>
            </div>
        </div>
    );
};