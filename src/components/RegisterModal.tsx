import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
  onRegister: (data: RegisterData) => void;
}

export interface RegisterData {
  idAnggota: string;
  nama: string;
  tipeKeanggotaan: string;
  institusi: string;
}

const RegisterModal = ({ open, onClose, onRegister }: RegisterModalProps) => {
  const [formData, setFormData] = useState<RegisterData>({
    idAnggota: "",
    nama: "",
    tipeKeanggotaan: "",
    institusi: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.idAnggota && formData.nama && formData.tipeKeanggotaan && formData.institusi) {
      onRegister(formData);
      setFormData({
        idAnggota: "",
        nama: "",
        tipeKeanggotaan: "",
        institusi: "",
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md animate-in fade-in-0 zoom-in-95 duration-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Daftar Anggota Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="idAnggota">ID Anggota</Label>
            <Input
              id="idAnggota"
              value={formData.idAnggota}
              onChange={(e) => setFormData({ ...formData, idAnggota: e.target.value })}
              placeholder="Masukkan kode unik kartu anggota"
              required
            />
          </div>

          <div>
            <Label htmlFor="nama">Nama Pengunjung</Label>
            <Input
              id="nama"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              placeholder="Nama lengkap"
              required
            />
          </div>

          <div>
            <Label htmlFor="tipeKeanggotaan">Tipe Keanggotaan</Label>
            <Select
              value={formData.tipeKeanggotaan}
              onValueChange={(value) => setFormData({ ...formData, tipeKeanggotaan: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih tipe keanggotaan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mahasiswa">Mahasiswa</SelectItem>
                <SelectItem value="Mahasiswa Skripsi">Mahasiswa Skripsi</SelectItem>
                <SelectItem value="Mahasiswa Tesis">Mahasiswa Tesis</SelectItem>
                <SelectItem value="Mahasiswa Disertasi">Mahasiswa Disertasi</SelectItem>
                <SelectItem value="Dosen">Dosen</SelectItem>
                <SelectItem value="Staf STTRII">Staf STTRII</SelectItem>
                <SelectItem value="Alumni STTRII">Alumni STTRII</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="institusi">Institusi</Label>
            <Input
              id="institusi"
              value={formData.institusi}
              onChange={(e) => setFormData({ ...formData, institusi: e.target.value })}
              placeholder="Nama institusi"
              required
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">Daftar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;
