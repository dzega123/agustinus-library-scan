import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Plus, Trash2, Search, Upload, FileDown, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportToExcel, exportMembersToPDF } from "@/utils/exportUtils";
import { useMembers } from "@/hooks/useSupabaseData";
import * as supabaseStorage from "@/utils/supabaseStorage";
import * as XLSX from 'xlsx';

const MembersManager = () => {
  const { members, loading, loadMembers, addMember, deleteMember } = useMembers();
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const filteredMembers = members.filter(
    (member) =>
      member.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.member_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (memberId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus anggota ini?")) {
      try {
        await deleteMember(memberId);
        toast({
          title: "Berhasil!",
          description: "Anggota berhasil dihapus",
          duration: 2000,
        });
      } catch (error) {
        toast({
          title: "Gagal!",
          description: "Terjadi kesalahan saat menghapus anggota",
          variant: "destructive",
          duration: 2000,
        });
      }
    }
  };

  const handleExportExcel = () => {
    const excelData = filteredMembers.map(m => ({
      'ID Anggota': m.member_id,
      'Nama': m.nama,
      'Tipe Keanggotaan': m.tipe_keanggotaan,
      'Jurusan': m.jurusan || '-',
      'No Telepon': m.no_telepon || '-',
      'Email': m.email || '-',
    }));
    exportToExcel(excelData, 'Daftar_Anggota');
    toast({
      title: "Berhasil!",
      description: "Data anggota berhasil diekspor ke Excel",
      duration: 2000,
    });
  };

  const handleExportPDF = () => {
    const pdfData = filteredMembers.map(m => ({
      idAnggota: m.member_id,
      nama: m.nama,
      tipeKeanggotaan: m.tipe_keanggotaan,
      institusi: m.jurusan || '-',
      registeredAt: new Date().toISOString(),
    }));
    exportMembersToPDF(pdfData);
    toast({
      title: "Berhasil!",
      description: "Data anggota berhasil diekspor ke PDF",
      duration: 2000,
    });
  };

  const handleDownloadTemplate = () => {
    const templateData = [{
      'ID Anggota': '',
      'Nama': '',
      'Tipe Keanggotaan': '',
      'Jurusan': '',
      'No Telepon': '',
      'Email': '',
    }];
    exportToExcel(templateData, 'Template_Anggota');
    toast({
      title: "Berhasil!",
      description: "Template Excel berhasil diunduh. Silakan isi data dan impor kembali.",
      duration: 2000,
    });
  };

  const handleImportExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const membersToImport = jsonData.map((row: any) => ({
          member_id: String(row['ID Anggota'] || row['member_id'] || row['id'] || '').trim(),
          nama: String(row['Nama'] || row['nama'] || row['name'] || '').trim(),
          tipe_keanggotaan: String(row['Tipe Keanggotaan'] || row['tipe_keanggotaan'] || row['type'] || '').trim(),
          jurusan: String(row['Jurusan'] || row['jurusan'] || '').trim(),
          no_telepon: String(row['No Telepon'] || row['no_telepon'] || '').trim(),
          email: String(row['Email'] || row['email'] || '').trim(),
        })).filter(member => member.member_id && member.nama && member.tipe_keanggotaan);

        if (membersToImport.length === 0) {
          toast({
            title: "Gagal!",
            description: "Tidak ada data valid yang ditemukan dalam file",
            variant: "destructive",
            duration: 2000,
          });
          return;
        }

        let added = 0;
        let duplicates = 0;

        for (const member of membersToImport) {
          try {
            const result = await supabaseStorage.addMember(member);
            if (result) {
              added++;
            } else {
              duplicates++;
            }
          } catch (error) {
            duplicates++;
          }
        }

        await loadMembers();

        let description = `${added} anggota berhasil diimpor`;
        if (duplicates > 0) {
          description += `, ${duplicates} duplikat dilewati`;
        }

        toast({
          title: "Berhasil!",
          description,
          duration: 2000,
        });

      } catch (error) {
        console.error('Import error:', error);
        toast({
          title: "Gagal!",
          description: "Terjadi kesalahan saat membaca file Excel",
          variant: "destructive",
          duration: 2000,
        });
      }
    };

    reader.readAsBinaryString(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Daftar Anggota Perpustakaan</h1>
        <p className="text-muted-foreground">Kelola data anggota perpustakaan</p>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi</CardTitle>
          <CardDescription>Tambah, ekspor, atau cetak data anggota</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleDownloadTemplate}>
            <FileDown className="w-4 h-4 mr-2" />
            Download Template
          </Button>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Download className="w-4 h-4 mr-2" />
            Impor Excel
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleImportExcel}
            className="hidden"
          />
          <Button variant="outline" onClick={handleExportExcel}>
            <Upload className="w-4 h-4 mr-2" />
            Ekspor Excel
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <Upload className="w-4 h-4 mr-2" />
            Ekspor PDF
          </Button>
        </CardContent>
      </Card>

      {/* Search and Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Cari nama atau ID anggota..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Anggota</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Tipe Keanggotaan</TableHead>
                <TableHead>Jurusan</TableHead>
                <TableHead>No Telepon</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Tidak ada data anggota
                  </TableCell>
                </TableRow>
              ) : (
                filteredMembers.map((member) => (
                  <TableRow key={member.member_id}>
                    <TableCell className="font-mono">{member.member_id}</TableCell>
                    <TableCell>{member.nama}</TableCell>
                    <TableCell>{member.tipe_keanggotaan}</TableCell>
                    <TableCell>{member.jurusan || '-'}</TableCell>
                    <TableCell>{member.no_telepon || '-'}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(member.member_id)}
                        title="Hapus"
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
    </div>
  );
};

export default MembersManager;
