import AdminLayout from "../../components/Admin/AdminLayout";

import Dashboard from "../../domain/Admin/Dashboard";

function Index() {
    return (
        <AdminLayout title="Home">
            <Dashboard/>
        </AdminLayout>
    );
};

export default Index;