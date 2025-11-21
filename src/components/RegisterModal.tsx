import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  photoUrl?: string;
}

const RegisterModal = ({ open, onClose, onRegister }: RegisterModalProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<RegisterData>({
    idAnggota: "",
    nama: "",
    tipeKeanggotaan: "",
    institusi: "",
    photoUrl: "",
  });
  const [photoPreview, setPhotoPreview] = useState<string>("");

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 3MB)
      if (file.size > 3 * 1024 * 1024) {
        toast({
          title: "Gagal!",
          description: "Ukuran foto maksimal 3MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPhotoPreview(base64String);
        setFormData({ ...formData, photoUrl: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview("");
    setFormData({ ...formData, photoUrl: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.idAnggota && formData.nama && formData.tipeKeanggotaan && formData.institusi) {
      onRegister(formData);
      setFormData({
        idAnggota: "",
        nama: "",
        tipeKeanggotaan: "",
        institusi: "",
        photoUrl: "",
      });
      setPhotoPreview("");
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
            <Label htmlFor="photo">Foto Anggota (Opsional, Max 3MB)</Label>
            <div className="mt-2 flex items-center gap-4">
              {photoPreview ? (
                <div className="relative">
                  <img 
                    src={photoPreview} 
                    alt="Preview" 
                    className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                    onClick={handleRemovePhoto}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                {photoPreview ? "Ganti Foto" : "Pilih Foto"}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
          </div>

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
