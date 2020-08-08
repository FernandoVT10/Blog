import ApiController from "../../../../../services/ApiController";

import { useEffect, useState } from "react";

export default ({ categories, onChangeCategories }) => {
    const [allCategories, setAllCategories] = useState([]);

    useEffect(() => {
        ApiController.get("categories")
        .then(res => {
            if(res.data) {
                setAllCategories(res.data.categories.map(category => {
                    let active = false;

                    categories.forEach((categoryName) => {
                        if(categoryName === category.name) {
                            active = true;
                        }
                    });

                    return {
                        name: category.name,
                        active
                    };
                }));
            }
        });
    }, []);

    const handleCheckbox = (categoryName) => {
        if(categories.includes(categoryName)) {
            onChangeCategories(categories.filter(
                category => category !== categoryName
            ));
        } else {
            onChangeCategories([...categories, categoryName]);
        }

        setAllCategories(allCategories.map(category => {
            if(category.name === categoryName) {
                return (
                    {
                        name: category.name,
                        active: !category.active
                    }
                );
            }
            
            return category;
        }));
    };

    return allCategories.map((category, index) => {
        return (
            <div key={index} className="formulary__checkbox">
                <input
                className="formulary__checkbox__input"
                id={`category-${category.name}`}
                onChange={() => handleCheckbox(category.name)}
                type="checkbox"
                checked={category.active} />

                <label
                className="formulary__checkbox__label"
                htmlFor={`category-${category.name}`}>
                    <span className="formulary__checkbox__label-checkbox"></span>
                    { category.name }
                </label>
            </div>
        );
    });
}