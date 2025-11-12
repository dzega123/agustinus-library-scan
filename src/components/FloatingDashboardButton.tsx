import { LayoutDashboard } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const FloatingDashboardButton = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-24 right-4 group z-50">
      <Button
        onClick={() => navigate("/dashboard")}
        variant="secondary"
        className="h-14 rounded-full shadow-lg transition-all duration-300 ease-out group-hover:pr-6 pr-4 pl-4"
        size="lg"
      >
        <LayoutDashboard className="w-5 h-5 shrink-0" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out group-hover:max-w-xs group-hover:ml-2">
          Dashboard
        </span>
      </Button>
    </div>
  );
};

export default FloatingDashboardButton;
