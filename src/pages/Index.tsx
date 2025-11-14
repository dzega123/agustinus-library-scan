import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  const [currentDate, setCurrentDate] = useState("");
  const [visitors, setVisitors] = useState(() => storageUtils.getTodayCheckIns());
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "" });

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const formatted = now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setCurrentDate(formatted);
    };

    updateDate();
    const interval = setInterval(updateDate, 1000);
    return () => clearInterval(interval);
  }, []);

  const showSuccess = (message: string) => {
    setNotification({ show: true, message });
  };

  const handleMemberCheckIn = (memberId: string) => {
    const member = storageUtils.findMemberById(memberId);
    if (member) {
      const checkIn = storageUtils.addCheckIn({
        nama: member.nama,
        type: member.tipeKeanggotaan,
        data: member,
      });
      setVisitors(storageUtils.getTodayCheckIns());
      showSuccess(`Selamat datang, ${member.nama}!`);
    } else {
      showSuccess("ID Anggota tidak ditemukan. Silakan daftar terlebih dahulu.");
    }
  };

  const handleNonMemberRegister = (data: NonAnggotaData) => {
    const checkIn = storageUtils.addCheckIn({
      nama: data.nama,
      type: "Non Anggota",
      data,
    });
    setVisitors(storageUtils.getTodayCheckIns());
    showSuccess(`Pendaftaran berhasil! Selamat datang, ${data.nama}!`);
  };

  const handleGroupRegister = (data: RombonganData) => {
    const checkIn = storageUtils.addCheckIn({
      nama: data.namaInstansi,
      type: "Rombongan",
      data,
    });
    setVisitors(storageUtils.getTodayCheckIns());
    showSuccess(`Rombongan dari ${data.namaInstansi} berhasil terdaftar!`);
  };

  const handleNewMemberRegister = (data: RegisterData) => {
    storageUtils.addMember(data);
    const checkIn = storageUtils.addCheckIn({
      nama: data.nama,
      type: data.tipeKeanggotaan,
      data,
    });
    setVisitors(storageUtils.getTodayCheckIns());
    showSuccess(`Pendaftaran anggota berhasil! Selamat datang, ${data.nama}!`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header currentDate={currentDate} visitorCount={visitors.length} />
      <WelcomeBanner visitorCount={visitors.length} />

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="anggota" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8">
            <TabsTrigger value="anggota">Anggota</TabsTrigger>
            <TabsTrigger value="non-anggota">Non Anggota</TabsTrigger>
            <TabsTrigger value="rombongan">Rombongan</TabsTrigger>
            <TabsTrigger value="today">Pengunjung Hari Ini</TabsTrigger>
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
        onClose={() => setNotification({ show: false, message: "" })}
      />
      
      <Footer />
    </div>
  );
};

export default Index;
