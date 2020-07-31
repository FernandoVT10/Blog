import ContactMeForm from "./ContactMeForm/ContactMeForm";

import "./ContactMe.scss";

export default () => {
    return (
        <div className="contact-me">
            <div className="body">
                <div className="container-fluid">
                    <div className="row">

                        <div className="col-12 contact-me__about-me">
                            <div className="contact-me__profile-container">
                                <div className="contact-me__cover"></div>
                                <img
                                className="contact-me__picture"
                                src="/img/profile-picture.jpg"
                                alt="My profile picture"/>
                            </div>

                            <h2 className="contact-me__title">About Fernando Vaca Tamayo</h2>
                            <p className="contact-me__description">
                                <b>Hello!</b>. I'm a mexican web developer.<br/>

                                I've been studying technology for more than 4 years.<br/>

                                Do i know <b>english</b> at a normal level?...
                                Well i can write and read.
                                I'm practicing <b>listening</b> and <b>speaking</b>.<br/>

                                I'm a little bad at design, but i'm <b>working</b> to fix it.<br/>

                                The language i like the most are <b>JavaScript</b>.<br/>

                                Now i'm studying <b>TypeScript</b>.<br/>

                                I really like to see <b>clean code</b>,
                                i find it so beautiful and fun.<br/>

                                And to finish a curious fact about me. I discovered the programming
                                thanks to <b>Minecraft</b> and it's <b>mods</b>.
                            </p>
                        </div>

                        <div className="col-lg-6 contact-me__form">
                            <ContactMeForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}