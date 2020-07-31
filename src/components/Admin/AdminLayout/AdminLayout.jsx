import Layout from "../../Layout";
import AdminNavbar from "../AdminNavbar";
import AdminLogin from "./AdminLogin";

import ApiController from "../../../services/ApiController";

import { useEffect, useState } from "react";

import "./AdminLayout.scss";

export default ({ children, title }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        ApiController.get("users/isLogged/", true)
        .then(res => {
            if(res.data) {
                setIsAuthenticated(res.data.isLogged);
            }
            
            setLoading(false);
        });
    }, []);

    if(loading) {
        return (
            <Layout title="Dashboard">
                <div className="admin-layout__loader">
                    <span className="spinner-border"></span>
                </div>
            </Layout>
        );
    }

    if(!isAuthenticated) {
        return (
            <Layout title="Dashboard - Login">
                <AdminLogin setIsAuthenticated={setIsAuthenticated}/>
            </Layout>
        );
    }

    return (
        <Layout title={`Dashboard - ${title}`}>
            <div className="admin-layout">
                <AdminNavbar />

                <div className="container-fluid admin-layout__wrapper">
                    { children }
                </div>
            </div>
        </Layout>
    );
};