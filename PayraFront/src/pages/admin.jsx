import { useState } from 'react';
import AdminSidebar from '../components/Admin/adminSidebar.jsx';
import ProductsManagement from '../components/Admin/productsManagement.jsx';
import OrdersManagement from '../components/Admin/ordersManagement.jsx';
import UsersManagement from '../components/Admin/userManagement.jsx';
import RequestsManagement from '../components/Admin/requestsManagement.jsx';
import MessagesManagement from '../components/Admin/messagesManagement.jsx';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products'); // Default tab
  
  // The security placeholder has been removed,
  // as this component is now protected by <AdminRoute> in App.jsx

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'products':
        return <ProductsManagement />;
      case 'orders':
        return <OrdersManagement />;
      case 'users':
        return <UsersManagement />;
      case 'requests':
        return <RequestsManagement />;
      case 'messages':
        return <MessagesManagement />;
      default:
        return <ProductsManagement />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Navigation */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10">
        {renderActiveTab()}
      </main>
    </div>
  );
};

export default AdminDashboard;

