import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import Header from "./Header";



export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <div className="min-h-screen md:ml-64">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}