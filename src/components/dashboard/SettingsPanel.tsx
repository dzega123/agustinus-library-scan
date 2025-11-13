import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Image, Lock } from "lucide-react";
import { storageUtils } from "@/utils/localStorage";
import { useToast } from "@/hooks/use-toast";

const SettingsPanel = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState(storageUtils.getSettings());
  const [libraryName, setLibraryName] = useState(settings.libraryName || "Perpustakaan Agustinus");
  const [footerText, setFooterText] = useState(settings.footerText || "Powered by INLISLite Perpusnas");
  const [username, setUsername] = useState(settings.adminUsername || "Admin");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);

  const handleLibrarySettingsSave = () => {
    if (logoFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        storageUtils.updateSettings({
          libraryName,
          logoUrl: e.target?.result as string,
        });
        toast({
          title: "Berhasil!",
          description: "Pengaturan perpustakaan berhasil disimpan",
        });
      };
      reader.readAsDataURL(logoFile);
    } else {
      storageUtils.updateSettings({ libraryName });
      toast({
        title: "Berhasil!",
        description: "Pengaturan perpustakaan berhasil disimpan",
      });
    }
  };

  const handleFaviconSave = () => {
    if (!faviconFile) {
      toast({
        title: "Error",
        description: "Silakan pilih file favicon terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const faviconUrl = e.target?.result as string;
      storageUtils.updateSettings({ faviconUrl });
      
      // Update the favicon in the document
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = faviconUrl;
      
      toast({
        title: "Berhasil!",
        description: "Favicon berhasil diperbarui",
      });
    };
    reader.readAsDataURL(faviconFile);
  };

  const handleSecurityUpdate = () => {
    if (newPassword && newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Password tidak cocok",
        variant: "destructive",
      });
      return;
    }

    const updates: any = { adminUsername: username };
    if (newPassword) {
      updates.adminPassword = newPassword;
    }

    storageUtils.updateSettings(updates);
    
    // Update localStorage admin credentials
    if (newPassword) {
      localStorage.setItem("library_admin_password", newPassword);
    }
    
    toast({
      title: "Berhasil!",
      description: "Pengaturan keamanan berhasil diperbarui",
    });
    
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleFooterSave = () => {
    storageUtils.updateSettings({ footerText });
    localStorage.setItem("library_footer_text", footerText);
    
    toast({
      title: "Berhasil!",
      description: "Footer berhasil diperbarui",
    });
  };

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
            <Input 
              value={libraryName} 
              onChange={(e) => setLibraryName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Logo Perpustakaan</Label>
            <Input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
            />
          </div>
          <Button onClick={handleLibrarySettingsSave}>Simpan Perubahan</Button>
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
            <Input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setFaviconFile(e.target.files?.[0] || null)}
            />
          </div>
          <Button onClick={handleFaviconSave}>Simpan Favicon</Button>
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
            <Input 
              type="text" 
              placeholder="Username admin" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Password Baru</Label>
            <Input 
              type="password" 
              placeholder="Masukkan password baru" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Konfirmasi Password</Label>
            <Input 
              type="password" 
              placeholder="Konfirmasi password baru" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <Button onClick={handleSecurityUpdate}>Update Keamanan</Button>
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
            <Input 
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
            />
          </div>
          <Button onClick={handleFooterSave}>Simpan Footer</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPanel;
