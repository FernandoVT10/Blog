import { useState } from "react";

import "./Category.scss";

const Category = ({ category, deleteCategory, updateCategoryName }) => {
    const [categoryName, setCategoryName] = useState(category.name);
    const [isEditing, setIsEditing] = useState(false);

    const handleOnBlur = () => {
        setIsEditing(false);
        setCategoryName(category.name);
    }

    const handleForm = e => {
        e.preventDefault();

        updateCategoryName(category._id, categoryName);
        setIsEditing(false);
    }

    if(isEditing) {
        return (
            <div className="admin-categories-category">
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
        <div className="admin-categories-category">
            <div
            className="admin-categories-category__badge"
            onClick={() => setIsEditing(true)}>
                { category.name }

                <button
                className="admin-categories-category__delete-button"
                onClick={() => deleteCategory(category._id)}>
                    <i className="fas fa-times"></i>
                </button>
            </div>
        </div>
    );
}

export default Category;