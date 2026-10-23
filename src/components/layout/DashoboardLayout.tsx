import { useLocation, Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import Header from "./Header";
import { UniversityDataProvider } from "@/context/UniversityDataContext";



export default function DashboardLayout() {
  const location = useLocation();

  return (
    <UniversityDataProvider>
      <div className="min-h-screen bg-slate-50">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <div className="min-h-screen md:ml-64">
          {/* Header */}
          <Header />

          {/* Page Content */}
          <main className="min-w-0 overflow-x-hidden p-4 sm:p-6 lg:p-8">
            <div key={location.pathname} className="page-enter">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </UniversityDataProvider>
  );
}
