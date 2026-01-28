import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import * as supabaseStorage from "@/utils/supabaseStorage";

const Index = () => {
  const { t, language } = useLanguage();
  const [currentDate, setCurrentDate] = useState("");
  const [visitors, setVisitors] = useState<supabaseStorage.CheckInData[]>([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [notification, setNotification] = useState({ 
    show: false, 
    message: "",
    memberName: "",
    memberPhoto: "",
  });

  const loadTodayVisitors = useCallback(async () => {
    try {
      const data = await supabaseStorage.getTodayCheckIns();
      setVisitors(data);
    } catch (error) {
      console.error("Error loading visitors:", error);
    }
  }, []);

  useEffect(() => {
    loadTodayVisitors();
  }, [loadTodayVisitors]);

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

  const handleMemberCheckIn = async (memberId: string) => {
    try {
      const member = await supabaseStorage.findMemberById(memberId);
      if (member) {
        const checkIn = await supabaseStorage.addCheckIn({
          member_id: member.member_id,
          nama: member.nama,
          type: member.tipe_keanggotaan,
          tipe_keanggotaan: member.tipe_keanggotaan,
          jurusan: member.jurusan,
          no_telepon: member.no_telepon,
        });
        
        if (checkIn) {
          await loadTodayVisitors();
          showSuccess(`${t("notif.welcome")}, ${member.nama}!`, member.nama);
        } else {
          showSuccess(t("notif.already.checkin"));
        }
      } else {
        showSuccess(t("notif.notfound"));
      }
    } catch (error) {
      console.error("Error during check-in:", error);
      showSuccess("Terjadi kesalahan saat check-in");
    }
  };

  const handleNonMemberRegister = async (data: NonAnggotaData) => {
    try {
      const checkIn = await supabaseStorage.addCheckIn({
        member_id: `non-${Date.now()}`,
        nama: data.nama,
        type: "Non Anggota",
        tipe_keanggotaan: "Non Anggota",
        jurusan: data.pekerjaan,
        alamat: data.alamat,
      });
      
      if (checkIn) {
        await loadTodayVisitors();
        showSuccess(`${t("notif.register.success")}, ${data.nama}!`, data.nama);
      } else {
        showSuccess(t("notif.already.checkin"));
      }
    } catch (error) {
      console.error("Error during registration:", error);
      showSuccess("Terjadi kesalahan saat registrasi");
    }
  };

  const handleGroupRegister = async (data: RombonganData) => {
    try {
      const checkIn = await supabaseStorage.addCheckIn({
        member_id: `group-${Date.now()}`,
        nama: data.namaInstansi,
        type: "Rombongan",
        tipe_keanggotaan: "Rombongan",
        jurusan: `${data.jumlahPersonil} orang`,
        alamat: data.alamatInstansi,
      });
      
      if (checkIn) {
        await loadTodayVisitors();
        showSuccess(t("notif.group.success").replace("{name}", data.namaInstansi));
      } else {
        showSuccess(t("notif.group.already"));
      }
    } catch (error) {
      console.error("Error during group registration:", error);
      showSuccess("Terjadi kesalahan saat registrasi");
    }
  };

  const handleNewMemberRegister = async (data: RegisterData) => {
    try {
      // Add member first
      await supabaseStorage.addMember({
        member_id: data.idAnggota,
        nama: data.nama,
        tipe_keanggotaan: data.tipeKeanggotaan,
        jurusan: data.institusi,
      });
      
      // Then check in
      const checkIn = await supabaseStorage.addCheckIn({
        member_id: data.idAnggota,
        nama: data.nama,
        type: data.tipeKeanggotaan,
        tipe_keanggotaan: data.tipeKeanggotaan,
        jurusan: data.institusi,
      });
      
      if (checkIn) {
        await loadTodayVisitors();
        showSuccess(`${t("notif.member.success")}, ${data.nama}!`, data.nama, data.photoUrl);
      } else {
        await loadTodayVisitors();
        showSuccess(t("notif.member.already"));
      }
    } catch (error) {
      console.error("Error during new member registration:", error);
      showSuccess("Terjadi kesalahan saat registrasi");
    }
  };

  // Transform visitors for TodayVisitorsTab format
  const transformedVisitors = visitors.map(v => ({
    id: v.id || "",
    nama: v.nama,
    type: v.type,
    timestamp: v.check_in_time || v.date || "",
    tujuanKunjungan: v.jurusan,
  }));

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
            <TodayVisitorsTab visitors={transformedVisitors} />
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
