import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Image, FileText, LogOut } from "lucide-react";
import * as supabaseStorage from "@/utils/supabaseStorage";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const SettingsPanel = () => {
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<any>({});
  const [libraryName, setLibraryName] = useState("");
  const [footerText, setFooterText] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [headerImageFile, setHeaderImageFile] = useState<File | null>(null);
  const [footerImageFile, setFooterImageFile] = useState<File | null>(null);
  const [headerHeight, setHeaderHeight] = useState(100);
  const [footerHeight, setFooterHeight] = useState(80);
  const [headerMarginTop, setHeaderMarginTop] = useState(15);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const data = await supabaseStorage.getSettings();
    if (data) {
      setSettings(data);
      setLibraryName(data.library_name || "Perpustakaan Agustinus");
      setFooterText(data.footer_text || "Powered by INLISLite Perpusnas");
      setHeaderHeight(data.header_height || 100);
      setFooterHeight(data.footer_height || 80);
      setHeaderMarginTop(data.header_margin_top || 15);
    }
  };

  const handleLibrarySettingsSave = async () => {
    let logoUrl = settings.header_image_url;
    
    if (logoFile) {
      logoUrl = await supabaseStorage.uploadImage(logoFile, 'header-logo');
    }

    await supabaseStorage.updateSettings({
      library_name: libraryName,
      header_image_url: logoUrl,
    });
    
    await loadSettings();
    toast({
      title: "Berhasil!",
      description: "Pengaturan perpustakaan berhasil disimpan",
      duration: 2000,
    });
  };

  const handleFaviconSave = async () => {
    if (!faviconFile) {
      toast({
        title: "Error",
        description: "Silakan pilih file favicon terlebih dahulu",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    const faviconUrl = await supabaseStorage.uploadImage(faviconFile, 'favicon');
    
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
      duration: 2000,
    });
  };

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logout berhasil",
      description: "Anda telah keluar dari sistem",
    });
    navigate("/");
  };

  const handleFooterSave = async () => {
    await supabaseStorage.updateSettings({ footer_text: footerText });
    await loadSettings();
    
    toast({
      title: "Berhasil!",
      description: "Footer berhasil diperbarui",
      duration: 2000,
    });
  };

  const handlePdfImagesUpload = async () => {
    let headerUrl = settings.header_image_url;
    let footerUrl = settings.footer_image_url;

    if (headerImageFile) {
      headerUrl = await supabaseStorage.uploadImage(headerImageFile, 'pdf-header');
    }
    if (footerImageFile) {
      footerUrl = await supabaseStorage.uploadImage(footerImageFile, 'pdf-footer');
    }

    await supabaseStorage.updateSettings({
      header_image_url: headerUrl,
      footer_image_url: footerUrl,
      header_height: headerHeight,
      footer_height: footerHeight,
      header_margin_top: headerMarginTop,
    });

    await loadSettings();
    toast({
      title: "Berhasil!",
      description: "Pengaturan gambar PDF berhasil disimpan",
      duration: 2000,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pengaturan Sistem</h1>
        <p className="text-muted-foreground">Konfigurasi sistem perpustakaan</p>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogOut className="w-5 h-5" />
            Akun Admin
          </CardTitle>
          <CardDescription>Informasi akun yang sedang login</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <p className="text-sm text-muted-foreground">{user?.email || "Tidak diketahui"}</p>
          </div>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </CardContent>
      </Card>

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
              maxLength={200}
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
              maxLength={500}
            />
          </div>
          <Button onClick={handleFooterSave}>Simpan Footer</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Header & Footer PDF Absensi Mahasiswa
          </CardTitle>
          <CardDescription>
            Upload gambar header dan footer untuk ekspor PDF absensi mahasiswa akhir
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pdf-header-image">Gambar Header</Label>
            <Input
              id="pdf-header-image"
              type="file"
              accept="image/*"
              onChange={(e) => setHeaderImageFile(e.target.files?.[0] || null)}
            />
            {settings.header_image_url && (
              <p className="text-sm text-muted-foreground">
                Header saat ini: Sudah diupload
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="header-height">Tinggi Header (px)</Label>
            <Input
              id="header-height"
              type="number"
              value={headerHeight}
              onChange={(e) => setHeaderHeight(Number(e.target.value))}
              min="50"
              max="200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="header-margin-top">Posisi Header dari Atas (px)</Label>
            <Input
              id="header-margin-top"
              type="number"
              value={headerMarginTop}
              onChange={(e) => setHeaderMarginTop(Number(e.target.value))}
              min="5"
              max="50"
            />
            <p className="text-sm text-muted-foreground">
              Atur jarak header dari margin atas. Nilai lebih kecil = lebih dekat ke atas
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pdf-footer-image">Gambar Footer</Label>
            <Input
              id="pdf-footer-image"
              type="file"
              accept="image/*"
              onChange={(e) => setFooterImageFile(e.target.files?.[0] || null)}
            />
            {settings.footer_image_url && (
              <p className="text-sm text-muted-foreground">
                Footer saat ini: Sudah diupload
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="footer-height">Tinggi Footer (px)</Label>
            <Input
              id="footer-height"
              type="number"
              value={footerHeight}
              onChange={(e) => setFooterHeight(Number(e.target.value))}
              min="50"
              max="200"
            />
          </div>

          <Button onClick={handlePdfImagesUpload}>
            Simpan Pengaturan PDF
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPanel;
