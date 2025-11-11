import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

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
}

const RombonganTab = ({ onRegister }: RombonganTabProps) => {
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
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.namaKetuaRombongan &&
      formData.namaInstansi &&
      formData.jumlahPersonil > 0
    ) {
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
      });
    }
  };

  const handleCountChange = (category: "jenisKelamin" | "pekerjaan" | "pendidikan", key: string, value: string) => {
    setFormData({
      ...formData,
      [category]: {
        ...formData[category],
        [key]: parseInt(value) || 0,
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
              required
            />
          </div>

          <div>
            <Label htmlFor="nomorTeleponKetua">Nomor Telepon Ketua Rombongan</Label>
            <Input
              id="nomorTeleponKetua"
              value={formData.nomorTeleponKetua}
              onChange={(e) =>
                setFormData({ ...formData, nomorTeleponKetua: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="namaInstansi">Nama Instansi Lembaga</Label>
            <Input
              id="namaInstansi"
              value={formData.namaInstansi}
              onChange={(e) =>
                setFormData({ ...formData, namaInstansi: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="nomorTeleponInstansi">Nomor Telepon Instansi Lembaga</Label>
            <Input
              id="nomorTeleponInstansi"
              value={formData.nomorTeleponInstansi}
              onChange={(e) =>
                setFormData({ ...formData, nomorTeleponInstansi: e.target.value })
              }
            />
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
          />
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
          />
        </div>

        <div>
          <Label htmlFor="jumlahPersonil">Jumlah Personil</Label>
          <Input
            id="jumlahPersonil"
            type="number"
            min="0"
            value={formData.jumlahPersonil || ""}
            onChange={(e) =>
              setFormData({ ...formData, jumlahPersonil: parseInt(e.target.value) || 0 })
            }
            required
          />
        </div>

        <div>
          <Label className="mb-3 block">Jenis Kelamin</Label>
          <div className="grid grid-cols-2 gap-4">
            {["Laki-Laki", "Perempuan"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
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

        <div className="flex gap-3 justify-center">
          <Button type="submit" className="px-8">
            Simpan
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
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

export default RombonganTab;
