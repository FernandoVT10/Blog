import AdminLayout from "../../components/Admin/AdminLayout";
import Articles from "../../domain/Admin/Articles";

export default () => {
    return (
        <AdminLayout title="Manage Articles">
            <Articles/>
        </AdminLayout>
    );
}