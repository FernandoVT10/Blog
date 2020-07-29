import Link from "next/link";

import "./SkillCard.scss";

export default ({ skill }) => {
    return (
        <Link href={`?skill=${skill.name}`}>
            <div
            className="skill mb-3">
                <div className="skill__image-container">
                    <img
                    className="skill__image"
                    src={`/img/skills/${skill.image}`}
                    alt={skill.name} />

                    <span
                    className="skill__image-hover"
                    style={{background: skill.color}}></span>
                </div>
                
                <div className="skill__title" style={{background: skill.color}}>
                    { skill.name }
                </div>
            </div>
        </Link>
    );
};