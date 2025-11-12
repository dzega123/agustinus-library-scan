import { useState } from "react";
import { Home, Users, UserCheck, FileText, BarChart3, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import DashboardHome from "@/components/dashboard/DashboardHome";
import MembersManager from "@/components/dashboard/MembersManager";
import VisitorsManager from "@/components/dashboard/VisitorsManager";
import Statistics from "@/components/dashboard/Statistics";
import SettingsPanel from "@/components/dashboard/SettingsPanel";

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("home");
  const navigate = useNavigate();

  const menuItems = [
    { id: "home", label: "Beranda", icon: Home },
    { id: "members", label: "Daftar Anggota", icon: Users },
    { id: "visitors", label: "Daftar Pengunjung", icon: UserCheck },
    { id: "statistics", label: "Grafik & Statistik", icon: BarChart3 },
    { id: "settings", label: "Pengaturan", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case "home":
        return <DashboardHome />;
      case "members":
        return <MembersManager />;
      case "visitors":
        return <VisitorsManager />;
      case "statistics":
        return <Statistics />;
      case "settings":
        return <SettingsPanel />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? "w-16" : "w-64"
        } bg-card border-r border-border transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {!sidebarCollapsed && (
            <h2 className="font-semibold text-lg">Dashboard Admin</h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="shrink-0"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                  activeMenu === item.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                } ${sidebarCollapsed ? "justify-center" : ""}`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Back to Home */}
        <div className="p-4 border-t border-border">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className={`w-full ${sidebarCollapsed ? "px-2" : ""}`}
          >
            <Home className="w-4 h-4 mr-2" />
            {!sidebarCollapsed && "Kembali ke Beranda"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
