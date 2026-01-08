import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { memberSchema, validateImageFile } from "@/lib/validations";
import { z } from "zod";

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
  onRegister: (data: RegisterData) => void;
  initialData?: RegisterData;
  isEditMode?: boolean;
}

export interface RegisterData {
  idAnggota: string;
  nama: string;
  tipeKeanggotaan: string;
  institusi: string;
  photoUrl?: string;
}

const RegisterModal = ({ open, onClose, onRegister, initialData, isEditMode = false }: RegisterModalProps) => {
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with existing data when editing
  useEffect(() => {
    if (open && initialData) {
      setFormData(initialData);
      setPhotoPreview(initialData.photoUrl || "");
      setErrors({});
    } else if (open && !isEditMode) {
      setFormData({
        idAnggota: "",
        nama: "",
        tipeKeanggotaan: "",
        institusi: "",
        photoUrl: "",
      });
      setPhotoPreview("");
      setErrors({});
    }
  }, [open, initialData, isEditMode]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast({
          title: "Gagal!",
          description: validation.error,
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
    setErrors({});
    
    try {
      // Validate form data with zod
      memberSchema.parse({
        idAnggota: formData.idAnggota,
        nama: formData.nama,
        tipeKeanggotaan: formData.tipeKeanggotaan,
        institusi: formData.institusi,
        photoUrl: formData.photoUrl,
      });
      
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
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(fieldErrors);
        toast({
          title: "Validasi Gagal",
          description: "Mohon periksa kembali data yang dimasukkan",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md animate-in fade-in-0 zoom-in-95 duration-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {isEditMode ? "Edit Anggota" : "Daftar Anggota Baru"}
          </DialogTitle>
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
                accept="image/jpeg,image/png,image/gif,image/webp"
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
              disabled={isEditMode}
              maxLength={50}
            />
            {errors.idAnggota && (
              <p className="text-sm text-destructive mt-1">{errors.idAnggota}</p>
            )}
          </div>

          <div>
            <Label htmlFor="nama">Nama Pengunjung</Label>
            <Input
              id="nama"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              placeholder="Nama lengkap"
              maxLength={200}
            />
            {errors.nama && (
              <p className="text-sm text-destructive mt-1">{errors.nama}</p>
            )}
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
            {errors.tipeKeanggotaan && (
              <p className="text-sm text-destructive mt-1">{errors.tipeKeanggotaan}</p>
            )}
          </div>

          <div>
            <Label htmlFor="institusi">Institusi</Label>
            <Input
              id="institusi"
              value={formData.institusi}
              onChange={(e) => setFormData({ ...formData, institusi: e.target.value })}
              placeholder="Nama institusi"
              maxLength={200}
            />
            {errors.institusi && (
              <p className="text-sm text-destructive mt-1">{errors.institusi}</p>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">{isEditMode ? "Simpan" : "Daftar"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;
