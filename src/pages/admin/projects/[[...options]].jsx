import AdminLayout from "../../../components/Admin/AdminLayout";
import Projects from "../../../domain/Admin/Projects";

export default () => {
    return (
        <AdminLayout title="Manage Projects">
            <Projects/>
        </AdminLayout>
    );
}