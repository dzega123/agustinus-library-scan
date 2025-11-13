import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { storageUtils } from "@/utils/localStorage";
import { useToast } from "@/hooks/use-toast";

const ThesisAttendance = () => {
  const [currentDate, setCurrentDate] = useState("");
  const [checkInId, setCheckInId] = useState("");
  const [checkOutId, setCheckOutId] = useState("");
  const [showData, setShowData] = useState(false);
  const [attendances, setAttendances] = useState(() => storageUtils.getTodayThesisAttendances());
  const { toast } = useToast();

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

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInId.trim()) return;

    const member = storageUtils.findMemberById(checkInId.trim());
    if (member) {
      const result = storageUtils.addThesisAttendance({
        studentId: checkInId.trim(),
        nama: member.nama,
        checkInTime: new Date().toISOString(),
      });
      
      if (result) {
        setAttendances(storageUtils.getTodayThesisAttendances());
        setCheckInId("");
        toast({
          title: "Berhasil!",
          description: `Check-in berhasil untuk ${member.nama}`,
        });
      } else {
        toast({
          title: "Sudah Check-in",
          description: `${member.nama} sudah melakukan check-in hari ini`,
          variant: "destructive",
        });
        setCheckInId("");
      }
    } else {
      toast({
        title: "Error",
        description: "ID tidak ditemukan",
        variant: "destructive",
      });
    }
  };

  const handleCheckOut = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkOutId.trim()) return;

    const success = storageUtils.updateThesisCheckOut(checkOutId.trim());
    if (success) {
      setAttendances(storageUtils.getTodayThesisAttendances());
      setCheckOutId("");
      toast({
        title: "Berhasil!",
        description: "Check-out berhasil",
      });
    } else {
      toast({
        title: "Error",
        description: "Tidak ada check-in untuk ID ini hari ini",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    setAttendances(storageUtils.getTodayThesisAttendances());
    setShowData(!showData);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header currentDate={currentDate} visitorCount={attendances.length} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            STT REFORMED INJILI INTERNASIONAL
          </h2>
          <h3 className="text-xl font-semibold text-foreground mb-1">
            PERPUSTAKAAN AGUSTINUS
          </h3>
          <p className="text-lg text-muted-foreground">
            ABSENSI MAHASISWA SKRIPSI DAN TESIS
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-xl font-semibold text-center mb-4">Check-in</h4>
              <form onSubmit={handleCheckIn} className="space-y-4">
                <Input
                  type="text"
                  value={checkInId}
                  onChange={(e) => setCheckInId(e.target.value)}
                  placeholder="Scan kartu Anda"
                  className="text-center"
                  autoFocus
                />
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  OK
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h4 className="text-xl font-semibold text-center mb-4">Check-out</h4>
              <form onSubmit={handleCheckOut} className="space-y-4">
                <Input
                  type="text"
                  value={checkOutId}
                  onChange={(e) => setCheckOutId(e.target.value)}
                  placeholder="Scan kartu Anda"
                  className="text-center"
                />
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                  OK
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mb-4">
          <Button onClick={handleRefresh} variant="outline" size="lg">
            <RefreshCw className="w-4 h-4 mr-2" />
            Cek Data/Refresh
          </Button>
        </div>

        {showData && (
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-xl font-bold text-center mb-4">
                Data Absensi Mahasiswa Skripsi dan Tesis
              </h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Masuk</TableHead>
                    <TableHead>Keluar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendances.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        Belum ada data absensi hari ini
                      </TableCell>
                    </TableRow>
                  ) : (
                    attendances.map((att, idx) => (
                      <TableRow key={att.id}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{att.studentId}</TableCell>
                        <TableCell>{att.nama}</TableCell>
                        <TableCell>
                          {new Date(att.checkInTime).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </TableCell>
                        <TableCell>
                          {att.checkOutTime
                            ? new Date(att.checkOutTime).toLocaleTimeString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                              })
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default ThesisAttendance;
