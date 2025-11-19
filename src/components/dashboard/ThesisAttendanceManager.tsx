import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import * as supabaseStorage from "@/utils/supabaseStorage";
import { Download, Calendar, Trash2 } from "lucide-react";
import { exportToExcel, exportThesisAttendanceToPDF } from "@/utils/exportUtils";
import { useToast } from "@/hooks/use-toast";

const ThesisAttendanceManager = () => {
  const { toast } = useToast();
  const [attendances, setAttendances] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await supabaseStorage.getThesisAttendances();
    const settingsData = await supabaseStorage.getSettings();
    setAttendances(data);
    setSettings(settingsData);
  };
  
  // Get current week's Monday and Friday as default
  const getWeekRange = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const monday = new Date(today.setDate(diff));
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    
    return {
      monday: monday.toISOString().split('T')[0],
      friday: friday.toISOString().split('T')[0]
    };
  };
  
  const weekRange = getWeekRange();
  const [startDate, setStartDate] = useState(weekRange.monday);
  const [endDate, setEndDate] = useState(weekRange.friday);

  const filteredAttendances = attendances.filter(att => {
    if (!startDate && !endDate) return true;
    const date = att.date || att.check_in_time?.split('T')[0];
    if (!date) return false;
    if (startDate && date < startDate) return false;
    if (endDate && date > endDate) return false;
    return true;
  });

  const handleExportExcel = () => {
    const excelData = filteredAttendances.map(att => ({
      'ID': att.student_id,
      'Nama': att.student_name,
      'Tanggal': new Date(att.check_in_time || att.date).toLocaleDateString('id-ID'),
      'Check-in': att.check_in_time ? new Date(att.check_in_time).toLocaleTimeString('id-ID') : '-',
      'Check-out': att.check_out_time ? new Date(att.check_out_time).toLocaleTimeString('id-ID') : '-'
    }));
    exportToExcel(excelData, 'Absensi_Mahasiswa_Skripsi_Tesis');
    toast({
      title: "Berhasil!",
      description: "Data absensi berhasil diekspor ke Excel",
    });
  };

  const handleExportPDF = () => {
    exportThesisAttendanceToPDF(
      filteredAttendances,
      startDate ? new Date(startDate).toLocaleDateString('id-ID') : '',
      endDate ? new Date(endDate).toLocaleDateString('id-ID') : '',
      settings.header_image_url,
      settings.footer_image_url,
      settings.header_height || 100,
      settings.footer_height || 80,
      settings.header_margin_top || 15
    );
    toast({
      title: "Berhasil!",
      description: "Data absensi berhasil diekspor ke PDF",
    });
  };

  const handleCleanupDuplicates = async () => {
    // Remove duplicates logic can be implemented if needed
    toast({
      title: "Info",
      description: "Fitur cleanup duplikat akan segera diimplementasikan",
    });
  };


  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Absensi Mahasiswa Skripsi dan Tesis</h1>
        <p className="text-muted-foreground">Kelola dan filter data absensi mahasiswa</p>
      </div>

      {/* Date Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Berdasarkan Tanggal</CardTitle>
          <CardDescription>Default: Senin - Jumat minggu ini</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-auto"
            />
            <span className="text-muted-foreground">s/d</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-auto"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => {
              const range = getWeekRange();
              setStartDate(range.monday);
              setEndDate(range.friday);
            }}
          >
            Reset ke Minggu Ini
          </Button>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi</CardTitle>
          <CardDescription>Ekspor atau cetak data absensi</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleExportExcel}>
            <Download className="w-4 h-4 mr-2" />
            Ekspor Excel
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="w-4 h-4 mr-2" />
            Ekspor PDF
          </Button>
          <Button variant="destructive" onClick={handleCleanupDuplicates}>
            <Trash2 className="w-4 h-4 mr-2" />
            Hapus Duplikat
          </Button>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Data Absensi ({filteredAttendances.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendances.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Tidak ada data absensi
                  </TableCell>
                </TableRow>
              ) : (
                filteredAttendances.map((att, idx) => (
                  <TableRow key={att.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{att.student_id}</TableCell>
                    <TableCell>{att.student_name}</TableCell>
                    <TableCell>
                      {att.check_in_time 
                        ? new Date(att.check_in_time).toLocaleDateString('id-ID')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {att.check_in_time
                        ? new Date(att.check_in_time).toLocaleTimeString('id-ID')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {att.check_out_time
                        ? new Date(att.check_out_time).toLocaleTimeString('id-ID')
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThesisAttendanceManager;
