import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "./LanguageSelector";

interface HeaderProps {
  currentDate: string;
  visitorCount: number;
}

const Header = ({ currentDate, visitorCount }: HeaderProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <header className="bg-gradient-to-r from-primary to-primary-dark text-white p-6 shadow-lg">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <div 
              className="bg-white p-2 rounded-lg cursor-pointer hover:scale-105 transition-transform"
              onClick={() => navigate("/")}
            >
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-accent">{t("header.title")}</h1>
              <p className="text-lg">{t("header.library")}</p>
              <p className="text-sm opacity-90">{t("header.center")}</p>
            </div>
          </div>
          <LanguageSelector />
        </div>
        <div className="text-right">
          <p className="text-sm opacity-90">{currentDate}</p>
          <p className="text-xs opacity-75">{t("header.visitors")}: {visitorCount}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
