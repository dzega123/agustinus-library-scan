import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Image, Lock } from "lucide-react";

const SettingsPanel = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pengaturan Sistem</h1>
        <p className="text-muted-foreground">Konfigurasi sistem perpustakaan</p>
      </div>

      {/* Library Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Pengaturan Perpustakaan
          </CardTitle>
          <CardDescription>Ubah nama dan logo perpustakaan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nama Perpustakaan</Label>
            <Input defaultValue="Perpustakaan Agustinus" />
          </div>
          <div className="space-y-2">
            <Label>Logo Perpustakaan</Label>
            <Input type="file" accept="image/*" />
          </div>
          <Button>Simpan Perubahan</Button>
        </CardContent>
      </Card>

      {/* Favicon Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            Favicon Website
          </CardTitle>
          <CardDescription>Ubah icon yang tampil di browser tab</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Upload Favicon</Label>
            <Input type="file" accept="image/*" />
          </div>
          <Button>Simpan Favicon</Button>
        </CardContent>
      </Card>

      {/* Admin Login Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Keamanan Admin
          </CardTitle>
          <CardDescription>Kelola username dan password admin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Username</Label>
            <Input type="text" placeholder="Username admin" />
          </div>
          <div className="space-y-2">
            <Label>Password Baru</Label>
            <Input type="password" placeholder="Masukkan password baru" />
          </div>
          <div className="space-y-2">
            <Label>Konfirmasi Password</Label>
            <Input type="password" placeholder="Konfirmasi password baru" />
          </div>
          <Button>Update Keamanan</Button>
        </CardContent>
      </Card>

      {/* Footer Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Footer</CardTitle>
          <CardDescription>Sesuaikan footer website (default: inlislite perpusnas)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Teks Footer</Label>
            <Input defaultValue="Powered by INLISLite Perpusnas" />
          </div>
          <Button>Simpan Footer</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPanel;
