import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { storageUtils } from "@/utils/localStorage";
import { Download, Printer, Plus, Pencil, Trash2, Search } from "lucide-react";

const MembersManager = () => {
  const [members, setMembers] = useState(storageUtils.getMembers());
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = members.filter(
    (member) =>
      member.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.idAnggota.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportExcel = () => {
    // TODO: Implement Excel export
    alert("Fitur ekspor Excel akan segera diimplementasikan");
  };

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    alert("Fitur ekspor PDF akan segera diimplementasikan");
  };

  const handlePrint = () => {
    // TODO: Implement print
    window.print();
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
          <Button>
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
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Cetak
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
                <TableHead>Institusi</TableHead>
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
                        <Button variant="ghost" size="icon">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="w-4 h-4" />
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
    </div>
  );
};

export default MembersManager;
