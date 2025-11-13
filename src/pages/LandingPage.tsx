import { BookOpen, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-12">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="bg-primary p-6 rounded-full shadow-2xl">
            <BookOpen className="w-24 h-24 text-primary-foreground" />
          </div>
        </div>

        {/* Library Name */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            STT REFORMED INJILI INTERNASIONAL
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-primary">
            PERPUSTAKAAN AGUSTINUS
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Button
            onClick={() => navigate("/buku-tamu")}
            size="lg"
            className="h-32 flex flex-col gap-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
          >
            <BookOpen className="w-12 h-12" />
            <span>Buku Tamu</span>
          </Button>

          <Button
            onClick={() => navigate("/absensi-mahasiswa")}
            size="lg"
            variant="outline"
            className="h-32 flex flex-col gap-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
          >
            <BookOpen className="w-12 h-12" />
            <span>Absensi Mahasiswa Akhir</span>
          </Button>

          <Button
            onClick={() => navigate("/login")}
            variant="secondary"
            size="lg"
            className="h-32 flex flex-col gap-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
          >
            <LayoutDashboard className="w-12 h-12" />
            <span>Dashboard</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
