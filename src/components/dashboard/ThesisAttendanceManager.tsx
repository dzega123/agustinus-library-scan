import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { storageUtils } from "@/utils/localStorage";
import { Download, Calendar } from "lucide-react";
import { exportToExcel, exportThesisAttendanceToPDF } from "@/utils/exportUtils";
import { useToast } from "@/hooks/use-toast";

const ThesisAttendanceManager = () => {
  const { toast } = useToast();
  const [attendances] = useState(storageUtils.getThesisAttendances());
  
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

  const filteredAttendances = attendances.filter((att) => {
    if (!startDate && !endDate) return true;
    const attDate = new Date(att.checkInTime);
    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999); // Include the entire end date
    return attDate >= start && attDate <= end;
  });

  const handleExportExcel = () => {
    const excelData = filteredAttendances.map(att => ({
      'ID': att.studentId,
      'Nama': att.nama,
      'Tanggal': new Date(att.checkInTime).toLocaleDateString('id-ID'),
      'Check-in': new Date(att.checkInTime).toLocaleTimeString('id-ID'),
      'Check-out': att.checkOutTime ? new Date(att.checkOutTime).toLocaleTimeString('id-ID') : '-'
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
      endDate ? new Date(endDate).toLocaleDateString('id-ID') : ''
    );
    toast({
      title: "Berhasil!",
      description: "Data absensi berhasil diekspor ke PDF",
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
                    <TableCell>{att.studentId}</TableCell>
                    <TableCell>{att.nama}</TableCell>
                    <TableCell>
                      {new Date(att.checkInTime).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell>
                      {new Date(att.checkInTime).toLocaleTimeString('id-ID')}
                    </TableCell>
                    <TableCell>
                      {att.checkOutTime
                        ? new Date(att.checkOutTime).toLocaleTimeString('id-ID')
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
