import Category from "./Category";
import AddCategory from "./AddCategory";

import ApiController from "@/services/ApiController";

import { useEffect, useState } from "react";

import "./Categories.scss";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        ApiController.get("categories")
        .then(res => {
            if(res.data) {
                setCategories(res.data.categories);
            }

            setLoading(false);
        });
    }, []);

    const addCategory = categoryName => {
        ApiController.post("categories", { name: categoryName }, true)
        .then(res => {
            if(res.data) {
                setCategories(
                    prevCategories => [...prevCategories, res.data.createdCategory]
                );
            }
        });
    }

    const updateCategoryName = (categoryId, categoryName) => {
        ApiController.put(`categories/${categoryId}`, { name: categoryName }, true)
        .then(res => {
            if(res.data) {
                setCategories(
                    categories.map(category => {
                        if(category._id === categoryId) {
                            return res.data.updatedCategory;
                        }

                        return category;
                    })
                );
            }
        });
    }

    const deleteCategory = (categoryId) => {
        ApiController.delete(`categories/${categoryId}`)
        .then(res => {
            if(!res.errors) {
                setCategories(
                    categories.filter(category => category._id !== categoryId)
                );
            }
        });
    }

    if(loading) {
        return (
            <div></div>
        );
    }

    return (
        <div className="admin-categories">
            <h3 className="admin-categories__title">Categorie List</h3>

            {categories.map(category => {
                return (
                    <Category
                    category={category}
                    deleteCategory={deleteCategory}
                    updateCategoryName={updateCategoryName}
                    key={category._id}/>
                );
            })}

            <AddCategory addCategory={addCategory}/>
        </div>
    );
}

export default Categories;