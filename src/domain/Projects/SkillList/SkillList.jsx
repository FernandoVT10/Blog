import SkillCard from "./SkillCard";

import ApiController from "../../../services/ApiController";

import { useState, useEffect } from "react";

import "./SkillList.scss";

export default () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        ApiController.get("skills")
        .then(res => {
            if(res.data) {
                setSkills(res.data.skills);
            }

            setLoading(false);
        });
    });

    if(loading) {
        return (
            <div className="col-12 skill-card-list__loader">
                <span className="spinner-border"></span>
            </div>
        );
    }

    if(!skills.length) {
        return (
            <div className="col-12 skill-card-list__not-available">
                There is not skills available
            </div>
        );
    }

    return (
        <div className="container-fluid skill-card-list mt-4">
            <div className="row skill-card-list__wrapper">
                <div className="col-12">
                    <h2 className="skill-card-list__title">Skills</h2>
                </div>

                {skills.map(skill => {
                    return (
                        <div
                        className="col-sm-6 col-md-6 col-lg-4 mb-3"
                        key={skill._id}>
                            <SkillCard skill={skill} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}