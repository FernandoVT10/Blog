import Link from "next/link";

import "./Navbar.scss";

export default () => {
    return (
        <header>
            <nav className="navbar navbar-expand-md navbar-dark">
                <Link href="/">
                    <a className="navbar-brand navbar__brand">
                        <img
                        src="/favicon.ico"
                        width="50"
                        height="50"
                        className="d-inline-block align-top rounded-circle"
                        alt="Icon" />
                        <h1 className="navbar__title">
                            Fernando Vaca Tamayo
                        </h1>
                    </a>
                </Link>

                <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#main-navbar"
                aria-controls="main-navbar"
                aria-expanded="false"
                aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse navbar__items" id="main-navbar">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link href="/">
                                <a className="nav-link navbar__link">Home</a>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/articles">
                                <a className="nav-link navbar__link">Articles</a>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/projects">
                                <a className="nav-link navbar__link">Projects</a>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/contact-me">
                                <a className="nav-link navbar__link">Contact me</a>
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};