import ApiController from "@/services/ApiController";

import Link from "next/link";
import { useEffect, useState } from "react";

import "./AdminNavbar.scss";

function AdminNavbar() {
    const [navbarStatus, setNavbarStatus] = useState(false);
    const [pendingMessagesCount, setPendingMessagesCount] = useState(0);

    useEffect(() => {
        ApiController.get("messages/pendingMessages", true)
        .then(res => {
            if(res.data) {
                setPendingMessagesCount(res.data.count);
            }
        });
    }, []);

    const navbarClass = navbarStatus ? "admin-navbar--active" : "";

    return (
        <nav className={`admin-navbar ${navbarClass}`}>
            <ul className="admin-navbar__items-container">
                <li className="admin-navbar__item-header">
                    <span
                    className="admin-navbar__item-icon"
                    onClick={() => setNavbarStatus(!navbarStatus)}>
                        <i className="fas fa-bars" aria-hidden="true"></i>
                    </span>

                    <h4 className="admin-navbar__item-title">Admin Blog</h4>
                </li>
                <li className="admin-navbar__item">
                    <Link href="/">
                        <a>
                            <span className="admin-navbar__item-icon">
                                <i className="fas fa-globe-americas" aria-hidden="true"></i>
                            </span>

                            <span className="admin-navbar__item-text">
                                Back to Website
                            </span>
                        </a>
                    </Link>
                </li>
                <li className="admin-navbar__item">
                    <Link href="/admin">
                        <a>
                            <span className="admin-navbar__item-icon">
                                <i className="fas fa-th-large" aria-hidden="true"></i>
                            </span>

                            <span className="admin-navbar__item-text">
                                Dashboard
                            </span>
                        </a>
                    </Link>
                </li>
                <li className="admin-navbar__item">
                    <Link href="/admin/articles">
                        <a>
                            <span className="admin-navbar__item-icon">
                                <i className="fas fa-images" aria-hidden="true"></i>
                            </span>

                            <span className="admin-navbar__item-text">
                                Articles
                            </span>
                        </a>
                    </Link>
                </li>
                <li className="admin-navbar__item">
                    <Link href="/admin/projects">
                        <a>
                            <span className="admin-navbar__item-icon">
                                <i className="fas fa-folder-open" aria-hidden="true"></i>
                            </span>

                            <span className="admin-navbar__item-text">
                                Projects
                            </span>
                        </a>
                    </Link>
                </li>
                <li className="admin-navbar__item">
                    <Link href="/admin/messages">
                        <a>
                            <span className="admin-navbar__item-icon">
                                <i className="fas fa-envelope" aria-hidden="true"></i>

                                { pendingMessagesCount &&
                                    <span className="admin-navbar__item-badge">
                                        { pendingMessagesCount }
                                    </span>
                                }
                            </span>

                            <span className="admin-navbar__item-text">
                                Messages
                            </span>
                        </a>
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default AdminNavbar;