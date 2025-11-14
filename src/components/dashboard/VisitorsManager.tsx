import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { storageUtils } from "@/utils/localStorage";
import { Download, Calendar, Trash2 } from "lucide-react";
import { exportToExcel, exportVisitorsToPDF } from "@/utils/exportUtils";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const VisitorsManager = () => {
  const { toast } = useToast();
  const [visitors, setVisitors] = useState(storageUtils.getCheckIns());
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    // Refresh visitors data
    setVisitors(storageUtils.getCheckIns());
  }, []);

  const filteredVisitors = visitors.filter((visitor) => {
    if (!startDate && !endDate) return true;
    const visitorDate = new Date(visitor.timestamp);
    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date();
    return visitorDate >= start && visitorDate <= end;
  });

  const handleExportExcel = () => {
    const excelData = filteredVisitors.map(v => ({
      'Nama': v.nama,
      'Tipe': v.type,
      'Tanggal': new Date(v.timestamp).toLocaleDateString('id-ID'),
      'Waktu': new Date(v.timestamp).toLocaleTimeString('id-ID')
    }));
    exportToExcel(excelData, 'Data_Pengunjung');
    toast({
      title: "Berhasil!",
      description: "Data pengunjung berhasil diekspor ke Excel",
    });
  };

  const handleExportPDF = () => {
    exportVisitorsToPDF(
      filteredVisitors,
      startDate ? new Date(startDate).toLocaleDateString('id-ID') : undefined,
      endDate ? new Date(endDate).toLocaleDateString('id-ID') : undefined
    );
    toast({
      title: "Berhasil!",
      description: "Data pengunjung berhasil diekspor ke PDF",
    });
  };

  const handleDelete = (id: string) => {
    storageUtils.deleteCheckIn(id);
    setVisitors(storageUtils.getCheckIns());
    setDeleteId(null);
    toast({
      title: "Berhasil!",
      description: "Data pengunjung berhasil dihapus",
    });
  };

  const handleCleanupDuplicates = () => {
    const removed = storageUtils.removeDuplicateCheckIns();
    setVisitors(storageUtils.getCheckIns());
    toast({
      title: "Berhasil!",
      description: `${removed} data duplikat berhasil dihapus`,
    });
  };


  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Daftar Pengunjung Perpustakaan</h1>
        <p className="text-muted-foreground">Kelola dan filter data pengunjung</p>
      </div>

      {/* Date Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Berdasarkan Tanggal</CardTitle>
          <CardDescription>Pilih rentang tanggal untuk filter data</CardDescription>
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
          <Button variant="outline" onClick={() => { setStartDate(""); setEndDate(""); }}>
            Reset Filter
          </Button>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi</CardTitle>
          <CardDescription>Ekspor atau cetak data pengunjung</CardDescription>
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
          <CardTitle>Data Pengunjung ({filteredVisitors.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Tipe Keanggotaan</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVisitors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Tidak ada data pengunjung
                  </TableCell>
                </TableRow>
              ) : (
                filteredVisitors.map((visitor) => (
                  <TableRow key={visitor.id}>
                    <TableCell>{visitor.nama}</TableCell>
                    <TableCell>{visitor.type}</TableCell>
                    <TableCell>
                      {new Date(visitor.timestamp).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell>
                      {new Date(visitor.timestamp).toLocaleTimeString("id-ID")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(visitor.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data Pengunjung?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data pengunjung akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VisitorsManager;
