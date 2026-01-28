import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import * as supabaseStorage from "@/utils/supabaseStorage";
import { useToast } from "@/hooks/use-toast";

const ThesisAttendance = () => {
  const { t, language } = useLanguage();
  const [currentDate, setCurrentDate] = useState("");
  const [checkInId, setCheckInId] = useState("");
  const [checkOutId, setCheckOutId] = useState("");
  const [showData, setShowData] = useState(false);
  const [attendances, setAttendances] = useState<supabaseStorage.ThesisAttendance[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadAttendances = useCallback(async () => {
    try {
      setLoading(true);
      const data = await supabaseStorage.getTodayThesisAttendances();
      setAttendances(data);
    } catch (error) {
      console.error("Error loading attendances:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAttendances();
  }, [loadAttendances]);

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const locale = language === "id" ? "id-ID" : language === "zh" ? "zh-CN" : "en-US";
      const formatted = now.toLocaleDateString(locale, {
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
  }, [language]);

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInId.trim()) return;

    try {
      const member = await supabaseStorage.findMemberById(checkInId.trim());
      if (member) {
        // Add to thesis attendance
        const thesisResult = await supabaseStorage.addOrUpdateThesisAttendance(
          checkInId.trim(),
          member.nama,
          'checkin'
        );
        
        if (thesisResult) {
          // Also add to check_ins (buku tamu)
          await supabaseStorage.addCheckIn({
            member_id: member.member_id,
            nama: member.nama,
            type: 'Mahasiswa Akhir',
            tipe_keanggotaan: 'Mahasiswa Akhir',
            jurusan: member.jurusan,
          });
          
          await loadAttendances();
          setCheckInId("");
          toast({
            title: t("notif.checkin.success"),
            description: `${t("notif.checkin.success")} ${member.nama}`,
          });
        } else {
          toast({
            title: t("notif.student.already.checkin"),
            description: `${member.nama} ${t("notif.student.already.checkin")}`,
            variant: "destructive",
          });
          setCheckInId("");
        }
      } else {
        toast({
          title: "Error",
          description: t("notif.student.notfound"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during check-in:", error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat check-in",
        variant: "destructive",
      });
    }
  };

  const handleCheckOut = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkOutId.trim()) return;

    try {
      // Verify member exists in members list
      const member = await supabaseStorage.findMemberById(checkOutId.trim());
      if (!member) {
        toast({
          title: "Error",
          description: t("notif.student.notfound"),
          variant: "destructive",
        });
        return;
      }

      const result = await supabaseStorage.addOrUpdateThesisAttendance(
        checkOutId.trim(),
        member.nama,
        'checkout'
      );
      
      if (result) {
        await loadAttendances();
        setCheckOutId("");
        toast({
          title: t("notif.checkout.success"),
          description: `${t("notif.checkout.success")} ${member.nama}`,
        });
      } else {
        toast({
          title: "Error",
          description: t("notif.checkout.notfound"),
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error during check-out:", error);
      toast({
        title: "Error",
        description: error.message || "Terjadi kesalahan saat check-out",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = async () => {
    await loadAttendances();
    setShowData(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header currentDate={currentDate} visitorCount={attendances.length} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {t("header.library")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("thesis.title")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-xl font-semibold text-center mb-4">{t("thesis.checkin.button")}</h4>
              <form onSubmit={handleCheckIn} className="space-y-4">
                <Input
                  type="text"
                  value={checkInId}
                  onChange={(e) => setCheckInId(e.target.value)}
                  placeholder={t("thesis.checkin.id.placeholder")}
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
              <h4 className="text-xl font-semibold text-center mb-4">{t("thesis.checkout.button")}</h4>
              <form onSubmit={handleCheckOut} className="space-y-4">
                <Input
                  type="text"
                  value={checkOutId}
                  onChange={(e) => setCheckOutId(e.target.value)}
                  placeholder={t("thesis.checkout.id.placeholder")}
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
          <Button onClick={handleRefresh} variant="outline" size="lg" disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            {t("thesis.refresh")}
          </Button>
        </div>

        {showData && (
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-xl font-bold text-center mb-4">
                {t("thesis.today")}
              </h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("thesis.table.no")}</TableHead>
                    <TableHead>{t("thesis.table.id")}</TableHead>
                    <TableHead>{t("thesis.table.name")}</TableHead>
                    <TableHead>{t("thesis.table.checkin")}</TableHead>
                    <TableHead>{t("thesis.table.checkout")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendances.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        {t("thesis.empty")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    attendances.map((att, idx) => (
                      <TableRow key={att.id}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{att.student_id}</TableCell>
                        <TableCell>{att.student_name}</TableCell>
                        <TableCell>
                          {att.check_in_time
                            ? new Date(att.check_in_time).toLocaleTimeString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                              })
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {att.check_out_time
                            ? new Date(att.check_out_time).toLocaleTimeString('id-ID', {
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
