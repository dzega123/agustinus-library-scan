import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

const Statistics = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Grafik & Statistik</h1>
        <p className="text-muted-foreground">Visualisasi data pengunjung perpustakaan</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Grafik Pengunjung
          </CardTitle>
          <CardDescription>Fitur grafik akan segera diimplementasikan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Grafik pengunjung berdasarkan tanggal, bulan, dan tahun akan ditampilkan di sini
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;
