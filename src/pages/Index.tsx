import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import WelcomeBanner from "@/components/WelcomeBanner";
import Footer from "@/components/Footer";
import AnggotaTab from "@/components/AnggotaTab";
import NonAnggotaTab, { NonAnggotaData } from "@/components/NonAnggotaTab";
import RombonganTab, { RombonganData } from "@/components/RombonganTab";
import TodayVisitorsTab from "@/components/TodayVisitorsTab";
import FloatingRegisterButton from "@/components/FloatingRegisterButton";
import RegisterModal, { RegisterData } from "@/components/RegisterModal";
import SuccessNotification from "@/components/SuccessNotification";
import { storageUtils } from "@/utils/localStorage";

const Index = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [currentDate, setCurrentDate] = useState("");
  const [visitors, setVisitors] = useState(() => storageUtils.getTodayCheckIns());
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [notification, setNotification] = useState({ 
    show: false, 
    message: "",
    memberName: "",
    memberPhoto: "",
  });

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const locale = language === "id" ? "id-ID" : language === "zh" ? "zh-CN" : "en-US";
      
      const dayName = now.toLocaleDateString(locale, { weekday: "long" });
      const day = now.getDate();
      const month = now.toLocaleDateString(locale, { month: "long" });
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      
      const formatted = `${dayName}, ${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`;
      setCurrentDate(formatted);
    };

    updateDate();
    const interval = setInterval(updateDate, 1000);
    return () => clearInterval(interval);
  }, [language]);

  const showSuccess = (message: string, name?: string, photo?: string) => {
    setNotification({ 
      show: true, 
      message,
      memberName: name || "",
      memberPhoto: photo || "",
    });
  };

  const handleMemberCheckIn = (memberId: string) => {
    const member = storageUtils.findMemberById(memberId);
    if (member) {
      const checkIn = storageUtils.addCheckIn({
        nama: member.nama,
        type: member.tipeKeanggotaan,
        data: member,
      });
      
      if (checkIn) {
        setVisitors(storageUtils.getTodayCheckIns());
        showSuccess(`${t("notif.welcome")}, ${member.nama}!`, member.nama, member.photoUrl);
      } else {
        showSuccess(t("notif.already.checkin"));
      }
    } else {
      showSuccess(t("notif.notfound"));
    }
  };

  const handleNonMemberRegister = (data: NonAnggotaData) => {
    const checkIn = storageUtils.addCheckIn({
      nama: data.nama,
      type: "Non Anggota",
      data,
    });
    
    if (checkIn) {
      setVisitors(storageUtils.getTodayCheckIns());
      showSuccess(`${t("notif.register.success")}, ${data.nama}!`, data.nama);
    } else {
      showSuccess(t("notif.already.checkin"));
    }
  };

  const handleGroupRegister = (data: RombonganData) => {
    const checkIn = storageUtils.addCheckIn({
      nama: data.namaInstansi,
      type: "Rombongan",
      data,
    });
    
    if (checkIn) {
      setVisitors(storageUtils.getTodayCheckIns());
      showSuccess(t("notif.group.success").replace("{name}", data.namaInstansi));
    } else {
      showSuccess(t("notif.group.already"));
    }
  };

  const handleNewMemberRegister = (data: RegisterData) => {
    storageUtils.addMember(data);
    const checkIn = storageUtils.addCheckIn({
      nama: data.nama,
      type: data.tipeKeanggotaan,
      data,
    });
    
    if (checkIn) {
      setVisitors(storageUtils.getTodayCheckIns());
      showSuccess(`${t("notif.member.success")}, ${data.nama}!`, data.nama, data.photoUrl);
    } else {
      setVisitors(storageUtils.getTodayCheckIns());
      showSuccess(t("notif.member.already"));
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header currentDate={currentDate} visitorCount={visitors.length} />
      <WelcomeBanner visitorCount={visitors.length} />

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="anggota" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8">
            <TabsTrigger value="anggota">{t("tab.member")}</TabsTrigger>
            <TabsTrigger value="non-anggota">{t("tab.nonmember")}</TabsTrigger>
            <TabsTrigger value="rombongan">{t("tab.group")}</TabsTrigger>
            <TabsTrigger value="today">{t("tab.visitors")}</TabsTrigger>
          </TabsList>

          <TabsContent value="anggota">
            <AnggotaTab onCheckIn={handleMemberCheckIn} />
          </TabsContent>

          <TabsContent value="non-anggota">
            <NonAnggotaTab onRegister={handleNonMemberRegister} />
          </TabsContent>

          <TabsContent value="rombongan">
            <RombonganTab onRegister={handleGroupRegister} />
          </TabsContent>

          <TabsContent value="today">
            <TodayVisitorsTab visitors={visitors} />
          </TabsContent>
        </Tabs>
      </div>

      <FloatingRegisterButton onClick={() => setShowRegisterModal(true)} />

      <RegisterModal
        open={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={handleNewMemberRegister}
      />

      <SuccessNotification
        show={notification.show}
        message={notification.message}
        memberName={notification.memberName}
        memberPhoto={notification.memberPhoto}
        onClose={() => setNotification({ show: false, message: "", memberName: "", memberPhoto: "" })}
      />
      
      <Footer />
    </div>
  );
};

export default Index;
