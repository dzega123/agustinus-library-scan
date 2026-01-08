import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { nonMemberSchema } from "@/lib/validations";
import { z } from "zod";

interface NonAnggotaTabProps {
  onRegister: (data: NonAnggotaData) => void;
}

export interface NonAnggotaData {
  nama: string;
  pekerjaan: string;
  pendidikan: string;
  jenisKelamin: string;
  alamat: string;
  tujuanKunjungan?: string;
}

const NonAnggotaTab = ({ onRegister }: NonAnggotaTabProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<NonAnggotaData>({
    nama: "",
    pekerjaan: "",
    pendidikan: "",
    jenisKelamin: "",
    alamat: "",
    tujuanKunjungan: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    try {
      nonMemberSchema.parse({
        nama: formData.nama,
        pekerjaan: formData.pekerjaan,
        pendidikan: formData.pendidikan,
        jenisKelamin: formData.jenisKelamin,
        alamat: formData.alamat || undefined,
        tujuanKunjungan: formData.tujuanKunjungan || undefined,
      });
      
      onRegister(formData);
      setFormData({
        nama: "",
        pekerjaan: "",
        pendidikan: "",
        jenisKelamin: "",
        alamat: "",
        tujuanKunjungan: "",
      });
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
    <div className="max-w-3xl mx-auto mt-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="nama">Nama Pengunjung</Label>
          <Input
            id="nama"
            value={formData.nama}
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
            maxLength={200}
          />
          {errors.nama && (
            <p className="text-sm text-destructive mt-1">{errors.nama}</p>
          )}
        </div>

        <div>
          <Label className="mb-3 block">Pekerjaan</Label>
          <div className="grid grid-cols-3 gap-4">
            {[
              "Pegawai Negeri",
              "Peneliti",
              "TNI/POLRI",
              "Pegawai Swasta",
              "Dosen",
              "Alumni STTRII",
              "Wiraswasta",
              "Guru",
              "Pelajar",
              "Mahasiswa",
              "Lainnya",
              "STAFF STTRII",
            ].map((job) => (
              <div key={job} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`job-${job}`}
                  name="pekerjaan"
                  value={job}
                  checked={formData.pekerjaan === job}
                  onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })}
                  className="w-4 h-4 text-primary"
                />
                <Label htmlFor={`job-${job}`} className="font-normal cursor-pointer">
                  {job}
                </Label>
              </div>
            ))}
          </div>
          {errors.pekerjaan && (
            <p className="text-sm text-destructive mt-1">{errors.pekerjaan}</p>
          )}
        </div>

        <div>
          <Label className="mb-3 block">Pendidikan Terakhir</Label>
          <div className="grid grid-cols-3 gap-4">
            {["SD", "D1", "D2", "SMP", "D3", "SMA", "S1", "S2", "S3"].map((edu) => (
              <div key={edu} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`edu-${edu}`}
                  name="pendidikan"
                  value={edu}
                  checked={formData.pendidikan === edu}
                  onChange={(e) => setFormData({ ...formData, pendidikan: e.target.value })}
                  className="w-4 h-4 text-primary"
                />
                <Label htmlFor={`edu-${edu}`} className="font-normal cursor-pointer">
                  {edu}
                </Label>
              </div>
            ))}
          </div>
          {errors.pendidikan && (
            <p className="text-sm text-destructive mt-1">{errors.pendidikan}</p>
          )}
        </div>

        <div>
          <Label className="mb-3 block">Jenis Kelamin</Label>
          <div className="flex gap-8">
            {["Laki-laki", "Perempuan"].map((gender) => (
              <div key={gender} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`gender-${gender}`}
                  name="jenisKelamin"
                  value={gender}
                  checked={formData.jenisKelamin === gender}
                  onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value })}
                  className="w-4 h-4 text-primary"
                />
                <Label htmlFor={`gender-${gender}`} className="font-normal cursor-pointer">
                  {gender}
                </Label>
              </div>
            ))}
          </div>
          {errors.jenisKelamin && (
            <p className="text-sm text-destructive mt-1">{errors.jenisKelamin}</p>
          )}
        </div>

        <div>
          <Label htmlFor="alamat">Alamat</Label>
          <Textarea
            id="alamat"
            value={formData.alamat}
            onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
            rows={3}
            maxLength={500}
          />
          {errors.alamat && (
            <p className="text-sm text-destructive mt-1">{errors.alamat}</p>
          )}
        </div>

        <div>
          <Label htmlFor="tujuanKunjungan">Tujuan Kunjungan (Opsional)</Label>
          <Textarea
            id="tujuanKunjungan"
            value={formData.tujuanKunjungan || ""}
            onChange={(e) => setFormData({ ...formData, tujuanKunjungan: e.target.value })}
            rows={2}
            placeholder="Contoh: Membaca buku, mencari referensi, dll."
            maxLength={500}
          />
          {errors.tujuanKunjungan && (
            <p className="text-sm text-destructive mt-1">{errors.tujuanKunjungan}</p>
          )}
        </div>

        <div className="flex gap-3 justify-center">
          <Button type="submit" className="px-8">
            Simpan
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFormData({
                nama: "",
                pekerjaan: "",
                pendidikan: "",
                jenisKelamin: "",
                alamat: "",
                tujuanKunjungan: "",
              });
              setErrors({});
            }}
          >
            Ulangi
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NonAnggotaTab;
