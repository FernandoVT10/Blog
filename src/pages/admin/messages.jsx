import AdminLayout from "@/components/Admin/AdminLayout";

import Messages from "@/domain/Admin/Messages";

const MessagesPage = () => {
    return (
        <AdminLayout title="Messages">
            <Messages/>
        </AdminLayout>
    );
}

export default MessagesPage;