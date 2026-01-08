import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { groupVisitorSchema } from "@/lib/validations";
import { z } from "zod";

interface RombonganTabProps {
  onRegister: (data: RombonganData) => void;
}

export interface RombonganData {
  namaKetuaRombongan: string;
  nomorTeleponKetua: string;
  namaInstansi: string;
  alamatInstansi: string;
  nomorTeleponInstansi: string;
  emailInstansi: string;
  jumlahPersonil: number;
  jenisKelamin: Record<string, number>;
  pekerjaan: Record<string, number>;
  pendidikan: Record<string, number>;
  tujuanKunjungan?: string;
}

const RombonganTab = ({ onRegister }: RombonganTabProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<RombonganData>({
    namaKetuaRombongan: "",
    nomorTeleponKetua: "",
    namaInstansi: "",
    alamatInstansi: "",
    nomorTeleponInstansi: "",
    emailInstansi: "",
    jumlahPersonil: 0,
    jenisKelamin: {},
    pekerjaan: {},
    pendidikan: {},
    tujuanKunjungan: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    try {
      groupVisitorSchema.parse({
        namaKetuaRombongan: formData.namaKetuaRombongan,
        nomorTeleponKetua: formData.nomorTeleponKetua || undefined,
        namaInstansi: formData.namaInstansi,
        alamatInstansi: formData.alamatInstansi || undefined,
        nomorTeleponInstansi: formData.nomorTeleponInstansi || undefined,
        emailInstansi: formData.emailInstansi || undefined,
        jumlahPersonil: formData.jumlahPersonil,
        jenisKelamin: formData.jenisKelamin,
        pekerjaan: formData.pekerjaan,
        pendidikan: formData.pendidikan,
        tujuanKunjungan: formData.tujuanKunjungan || undefined,
      });
      
      onRegister(formData);
      setFormData({
        namaKetuaRombongan: "",
        nomorTeleponKetua: "",
        namaInstansi: "",
        alamatInstansi: "",
        nomorTeleponInstansi: "",
        emailInstansi: "",
        jumlahPersonil: 0,
        jenisKelamin: {},
        pekerjaan: {},
        pendidikan: {},
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

  const handleCountChange = (category: "jenisKelamin" | "pekerjaan" | "pendidikan", key: string, value: string) => {
    const numValue = Math.max(0, Math.min(10000, parseInt(value) || 0));
    setFormData({
      ...formData,
      [category]: {
        ...formData[category],
        [key]: numValue,
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="namaKetuaRombongan">Nama Ketua Rombongan</Label>
            <Input
              id="namaKetuaRombongan"
              value={formData.namaKetuaRombongan}
              onChange={(e) =>
                setFormData({ ...formData, namaKetuaRombongan: e.target.value })
              }
              maxLength={200}
            />
            {errors.namaKetuaRombongan && (
              <p className="text-sm text-destructive mt-1">{errors.namaKetuaRombongan}</p>
            )}
          </div>

          <div>
            <Label htmlFor="nomorTeleponKetua">Nomor Telepon Ketua Rombongan</Label>
            <Input
              id="nomorTeleponKetua"
              value={formData.nomorTeleponKetua}
              onChange={(e) =>
                setFormData({ ...formData, nomorTeleponKetua: e.target.value })
              }
              maxLength={20}
            />
            {errors.nomorTeleponKetua && (
              <p className="text-sm text-destructive mt-1">{errors.nomorTeleponKetua}</p>
            )}
          </div>

          <div>
            <Label htmlFor="namaInstansi">Nama Instansi Lembaga</Label>
            <Input
              id="namaInstansi"
              value={formData.namaInstansi}
              onChange={(e) =>
                setFormData({ ...formData, namaInstansi: e.target.value })
              }
              maxLength={200}
            />
            {errors.namaInstansi && (
              <p className="text-sm text-destructive mt-1">{errors.namaInstansi}</p>
            )}
          </div>

          <div>
            <Label htmlFor="nomorTeleponInstansi">Nomor Telepon Instansi Lembaga</Label>
            <Input
              id="nomorTeleponInstansi"
              value={formData.nomorTeleponInstansi}
              onChange={(e) =>
                setFormData({ ...formData, nomorTeleponInstansi: e.target.value })
              }
              maxLength={20}
            />
            {errors.nomorTeleponInstansi && (
              <p className="text-sm text-destructive mt-1">{errors.nomorTeleponInstansi}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="alamatInstansi">Alamat Instansi Lembaga</Label>
          <Textarea
            id="alamatInstansi"
            value={formData.alamatInstansi}
            onChange={(e) =>
              setFormData({ ...formData, alamatInstansi: e.target.value })
            }
            rows={2}
            maxLength={500}
          />
          {errors.alamatInstansi && (
            <p className="text-sm text-destructive mt-1">{errors.alamatInstansi}</p>
          )}
        </div>

        <div>
          <Label htmlFor="emailInstansi">Alamat Email Instansi Lembaga</Label>
          <Input
            id="emailInstansi"
            type="email"
            value={formData.emailInstansi}
            onChange={(e) =>
              setFormData({ ...formData, emailInstansi: e.target.value })
            }
            maxLength={255}
          />
          {errors.emailInstansi && (
            <p className="text-sm text-destructive mt-1">{errors.emailInstansi}</p>
          )}
        </div>

        <div>
          <Label htmlFor="jumlahPersonil">Jumlah Personil</Label>
          <Input
            id="jumlahPersonil"
            type="number"
            min="1"
            max="10000"
            value={formData.jumlahPersonil || ""}
            onChange={(e) =>
              setFormData({ ...formData, jumlahPersonil: Math.max(0, Math.min(10000, parseInt(e.target.value) || 0)) })
            }
          />
          {errors.jumlahPersonil && (
            <p className="text-sm text-destructive mt-1">{errors.jumlahPersonil}</p>
          )}
        </div>

        <div>
          <Label className="mb-3 block">Jenis Kelamin</Label>
          <div className="grid grid-cols-2 gap-4">
            {["Laki-Laki", "Perempuan"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="10000"
                  placeholder="0"
                  className="w-20"
                  value={formData.jenisKelamin[item] || ""}
                  onChange={(e) => handleCountChange("jenisKelamin", item, e.target.value)}
                />
                <Label className="font-normal">{item}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-3 block">Pekerjaan</Label>
          <div className="grid grid-cols-3 gap-4">
            {["PNS", "Pegawai Swasta", "Peneliti", "Guru", "Dosen", "Pensiunan", "TNI", "Wiraswasta", "Pelajar", "Mahasiswa", "Lainnya"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="10000"
                  placeholder="0"
                  className="w-20"
                  value={formData.pekerjaan[item] || ""}
                  onChange={(e) => handleCountChange("pekerjaan", item, e.target.value)}
                />
                <Label className="font-normal">{item}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-3 block">Pendidikan Terakhir</Label>
          <div className="grid grid-cols-3 gap-4">
            {["SD", "SMP (sederajat)", "SMA (sederajat)", "Diploma (D1)", "Diploma (D2)", "Diploma (D3)", "Sarjana (S1)", "Magister (S2)", "Doktor (S3)"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="10000"
                  placeholder="0"
                  className="w-20"
                  value={formData.pendidikan[item] || ""}
                  onChange={(e) => handleCountChange("pendidikan", item, e.target.value)}
                />
                <Label className="font-normal">{item}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="tujuanKunjungan">Tujuan Kunjungan (Opsional)</Label>
          <Textarea
            id="tujuanKunjungan"
            value={formData.tujuanKunjungan || ""}
            onChange={(e) =>
              setFormData({ ...formData, tujuanKunjungan: e.target.value })
            }
            rows={2}
            placeholder="Contoh: Kunjungan edukasi, studi banding, dll."
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
                namaKetuaRombongan: "",
                nomorTeleponKetua: "",
                namaInstansi: "",
                alamatInstansi: "",
                nomorTeleponInstansi: "",
                emailInstansi: "",
                jumlahPersonil: 0,
                jenisKelamin: {},
                pekerjaan: {},
                pendidikan: {},
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

export default RombonganTab;
