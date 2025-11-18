import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import * as supabaseStorage from "@/utils/supabaseStorage";
import { Download, Plus, Pencil, Trash2, Search } from "lucide-react";
import RegisterModal, { RegisterData } from "@/components/RegisterModal";
import { useToast } from "@/hooks/use-toast";
import { exportToExcel, exportMembersToPDF } from "@/utils/exportUtils";

const MembersManager = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    const data = await supabaseStorage.getMembers();
    setMembers(data);
  };

  const filteredMembers = members.filter(
    (member) =>
      member.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.member_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRegister = async (data: RegisterData) => {
    await supabaseStorage.addMember({
      member_id: data.idAnggota,
      nama: data.nama,
      tipe_keanggotaan: data.tipeKeanggotaan,
      jurusan: data.institusi,
      no_telepon: '',
      alamat: '',
      email: '',
    });
    await loadMembers();
    toast({
      title: "Berhasil!",
      description: "Anggota baru berhasil didaftarkan",
    });
  };

  const handleDelete = async (memberId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus anggota ini?")) {
      await supabaseStorage.deleteMember(memberId);
      await loadMembers();
      toast({
        title: "Berhasil!",
        description: "Anggota berhasil dihapus",
      });
    }
  };

  const handleExportExcel = () => {
    const excelData = filteredMembers.map(m => ({
      'ID Anggota': m.member_id,
      'Nama': m.nama,
      'Tipe Keanggotaan': m.tipe_keanggotaan,
      'Jurusan': m.jurusan,
      'Email': m.email || '-',
      'No Telepon': m.no_telepon || '-',
      'Alamat': m.alamat || '-',
      'Tanggal Daftar': new Date(m.created_at).toLocaleDateString('id-ID')
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
                  <TableRow key={member.member_id}>
                    <TableCell className="font-mono">{member.member_id}</TableCell>
                    <TableCell>{member.nama}</TableCell>
                    <TableCell>{member.tipe_keanggotaan}</TableCell>
                    <TableCell>{member.jurusan}</TableCell>
                    <TableCell>
                      {new Date(member.created_at).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(member.member_id)}
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
