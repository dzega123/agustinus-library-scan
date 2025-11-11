import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Textarea } from "./ui/textarea";

interface NonAnggotaTabProps {
  onRegister: (data: NonAnggotaData) => void;
}

export interface NonAnggotaData {
  nama: string;
  pekerjaan: string;
  pendidikan: string;
  jenisKelamin: string;
  alamat: string;
}

const NonAnggotaTab = ({ onRegister }: NonAnggotaTabProps) => {
  const [formData, setFormData] = useState<NonAnggotaData>({
    nama: "",
    pekerjaan: "",
    pendidikan: "",
    jenisKelamin: "",
    alamat: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nama && formData.pekerjaan && formData.pendidikan && formData.jenisKelamin) {
      onRegister(formData);
      setFormData({
        nama: "",
        pekerjaan: "",
        pendidikan: "",
        jenisKelamin: "",
        alamat: "",
      });
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
            required
          />
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
        </div>

        <div>
          <Label className="mb-3 block">Pendidikan Terakhir</Label>
          <div className="grid grid-cols-3 gap-4">
            {["SD", "D1", "D2", "SMP", "D2", "D3", "SMA", "S1", "S2", "S3"].map((edu) => (
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
        </div>

        <div>
          <Label htmlFor="alamat">Alamat</Label>
          <Textarea
            id="alamat"
            value={formData.alamat}
            onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
            rows={3}
          />
        </div>

        <div className="flex gap-3 justify-center">
          <Button type="submit" className="px-8">
            Simpan
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setFormData({
                nama: "",
                pekerjaan: "",
                pendidikan: "",
                jenisKelamin: "",
                alamat: "",
              })
            }
          >
            Ulangi
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NonAnggotaTab;
