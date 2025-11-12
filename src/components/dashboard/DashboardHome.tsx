import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, TrendingUp } from "lucide-react";
import { storageUtils } from "@/utils/localStorage";

const DashboardHome = () => {
  const members = storageUtils.getMembers();
  const todayVisitors = storageUtils.getTodayCheckIns();
  const allVisitors = storageUtils.getCheckIns();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Perpustakaan Agustinus</h1>
        <p className="text-muted-foreground">STT Reformed Injili Internasional</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Anggota</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.length}</div>
            <p className="text-xs text-muted-foreground">Anggota terdaftar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengunjung Hari Ini</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayVisitors.length}</div>
            <p className="text-xs text-muted-foreground">Check-in hari ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kunjungan</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allVisitors.length}</div>
            <p className="text-xs text-muted-foreground">Total check-in</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Selamat Datang</CardTitle>
          <CardDescription>
            Gunakan menu di sebelah kiri untuk mengelola data perpustakaan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Kelola daftar anggota perpustakaan</p>
            <p>• Lihat dan filter data pengunjung</p>
            <p>• Ekspor data ke Excel atau PDF</p>
            <p>• Lihat statistik dan grafik kunjungan</p>
            <p>• Atur pengaturan sistem</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
