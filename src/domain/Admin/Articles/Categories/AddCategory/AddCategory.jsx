import { useState } from "react";

import "./AddCategory.scss";

const AddCategory = ({ addCategory }) => {
    const [categoryName, setCategoryName] = useState("");
    const [isEditing, setIsEditing] = useState("");

    const handleOnBlur = () => {
        setIsEditing(false);
        setCategoryName("");
    }

    const handleForm = e => {
        e.preventDefault();

        addCategory(categoryName);
        setCategoryName("");
        setIsEditing(false);
    }

    if(isEditing) {
        return (
            <div className="admin-categories-add-category">
                <form onSubmit={handleForm}>
                    <input
                    type="text"
                    className="admin-categories__input"
                    onChange={({ target: { value } }) => setCategoryName(value)}
                    value={categoryName}
                    autoFocus={true}
                    onBlur={handleOnBlur}/>
                </form>
            </div>
        );
    }

    return (
        <div className="admin-categories-add-category">
            <button
            className="admin-categories-add-category__add-button"
            onClick={() => setIsEditing(true)}>
                <i className="fas fa-plus"></i>
            </button>
        </div>
    );
}

export default AddCategory;