import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "zh", name: "简体中文", flag: "🇨🇳" },
  ];

  return (
    <div className="flex gap-2">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant="outline"
          size="icon"
          onClick={() => setLanguage(lang.code as "id" | "en" | "zh")}
          className={`rounded-full w-12 h-12 border-2 transition-all ${
            language === lang.code 
              ? "bg-white border-accent scale-110" 
              : "bg-white/70 hover:bg-white/90 border-white"
          }`}
        >
          <span className="text-2xl">{lang.flag}</span>
        </Button>
      ))}
    </div>
  );
};

export default LanguageSelector;
