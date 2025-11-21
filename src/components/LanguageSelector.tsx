import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import flagEn from "@/assets/flag-en.png";
import flagZh from "@/assets/flag-zh.png";
import flagId from "@/assets/flag-id.png";

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: "id", name: "Bahasa Indonesia", flag: flagId },
    { code: "en", name: "English", flag: flagEn },
    { code: "zh", name: "简体中文", flag: flagZh },
  ];

  return (
    <div className="flex gap-1.5">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant="outline"
          size="icon"
          onClick={() => setLanguage(lang.code as "id" | "en" | "zh")}
          className={`rounded-full w-8 h-8 p-0 border transition-all hover:scale-110 ${
            language === lang.code 
              ? "bg-white border-accent shadow-md scale-105" 
              : "bg-white/80 hover:bg-white border-white/60"
          }`}
        >
          <img 
            src={lang.flag} 
            alt={lang.name}
            className="w-4 h-4 object-contain"
          />
        </Button>
      ))}
    </div>
  );
};

export default LanguageSelector;
