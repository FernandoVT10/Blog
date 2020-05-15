import Layout from "../../Layout";
import AdminNavbar from "../AdminNavbar";

import "./AdminLayout.scss";

export default ({ children, title }) => {
    return (
        <Layout title={title}>
            <div className="admin-layout">
                <AdminNavbar />

                <div className="container-fluid admin-layout__wrapper">
                    { children }
                </div>
            </div>
        </Layout>
    );
};