import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { storageUtils } from "@/utils/localStorage";
import { Download, Plus, Pencil, Trash2, Search, Upload, FileDown } from "lucide-react";
import RegisterModal, { RegisterData } from "@/components/RegisterModal";
import { useToast } from "@/hooks/use-toast";
import { exportToExcel, exportMembersToPDF } from "@/utils/exportUtils";
import * as XLSX from 'xlsx';

const MembersManager = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = () => {
    setMembers(storageUtils.getMembers());
  };

  const filteredMembers = members.filter(
    (member) =>
      member.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.idAnggota.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRegister = (data: RegisterData) => {
    const result = storageUtils.addMember({
      idAnggota: data.idAnggota,
      nama: data.nama,
      tipeKeanggotaan: data.tipeKeanggotaan,
      institusi: data.institusi,
    });
    
    if (result) {
      loadMembers();
      setIsRegisterModalOpen(false);
      toast({
        title: "Berhasil!",
        description: "Anggota baru berhasil didaftarkan",
      });
    } else {
      toast({
        title: "Gagal!",
        description: "ID Anggota sudah terdaftar",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (memberId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus anggota ini?")) {
      storageUtils.deleteMember(memberId);
      loadMembers();
      toast({
        title: "Berhasil!",
        description: "Anggota berhasil dihapus",
      });
    }
  };

  const handleExportExcel = () => {
    const excelData = filteredMembers.map(m => ({
      'ID Anggota': m.idAnggota,
      'Nama': m.nama,
      'Tipe Keanggotaan': m.tipeKeanggotaan,
      'Institusi': m.institusi,
      'Tanggal Daftar': new Date(m.registeredAt).toLocaleDateString('id-ID')
    }));
    exportToExcel(excelData, 'Daftar_Anggota');
    toast({
      title: "Berhasil!",
      description: "Data anggota berhasil diekspor ke Excel",
    });
  };

  const handleExportPDF = () => {
    exportMembersToPDF(filteredMembers);
    toast({
      title: "Berhasil!",
      description: "Data anggota berhasil diekspor ke PDF",
    });
  };

  const handleDownloadTemplate = () => {
    const templateData = [{
      'ID Anggota': '',
      'Nama': '',
      'Tipe Keanggotaan': '',
      'Institusi': ''
    }];
    exportToExcel(templateData, 'Template_Anggota');
    toast({
      title: "Berhasil!",
      description: "Template Excel berhasil diunduh. Silakan isi data dan impor kembali.",
    });
  };

  const handleImportExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const membersToImport = jsonData.map((row: any) => ({
          idAnggota: String(row['ID Anggota'] || row['idAnggota'] || row['id'] || '').trim(),
          nama: String(row['Nama'] || row['nama'] || row['name'] || '').trim(),
          tipeKeanggotaan: String(row['Tipe Keanggotaan'] || row['tipeKeanggotaan'] || row['type'] || '').trim(),
          institusi: String(row['Institusi'] || row['institusi'] || row['institution'] || '').trim(),
        })).filter(member => member.idAnggota && member.nama);

        if (membersToImport.length === 0) {
          toast({
            title: "Gagal!",
            description: "Tidak ada data valid yang ditemukan dalam file",
            variant: "destructive",
          });
          return;
        }

        const result = storageUtils.addMembersBulk(membersToImport);
        loadMembers();

        let description = `${result.added} anggota berhasil diimpor`;
        if (result.duplicates.length > 0) {
          description += `, ${result.duplicates.length} duplikat dilewati`;
        }

        toast({
          title: "Berhasil!",
          description,
        });

      } catch (error) {
        console.error('Import error:', error);
        toast({
          title: "Gagal!",
          description: "Terjadi kesalahan saat membaca file Excel",
          variant: "destructive",
        });
      }
    };

    reader.readAsBinaryString(file);
    
    // Reset input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


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
          <Button onClick={() => setIsRegisterModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Anggota
          </Button>
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
                <TableHead>Tanggal Daftar</TableHead>
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
                  <TableRow key={member.idAnggota}>
                    <TableCell className="font-mono">{member.idAnggota}</TableCell>
                    <TableCell>{member.nama}</TableCell>
                    <TableCell>{member.tipeKeanggotaan}</TableCell>
                    <TableCell>{member.institusi}</TableCell>
                    <TableCell>
                      {new Date(member.registeredAt).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(member.idAnggota)}
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <RegisterModal
        open={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegister={handleRegister}
      />
    </div>
  );
};

export default MembersManager;
