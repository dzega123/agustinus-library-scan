import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Calendar, Loader2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MonthlyStatistics = () => {
  const [yearData, setYearData] = useState<any[]>([]);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadYearData = useCallback(async () => {
    setLoading(true);
    try {
      const startDate = `${currentYear}-01-01`;
      const endDate = `${currentYear}-12-31`;

      const { data, error } = await supabase
        .from('check_ins')
        .select('date')
        .gte('date', startDate)
        .lte('date', endDate);

      if (error) throw error;

      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
      ];

      const monthlyCounts: { [key: number]: number } = {};
      for (let i = 0; i < 12; i++) {
        monthlyCounts[i] = 0;
      }

      data?.forEach((item) => {
        if (item.date) {
          const month = new Date(item.date).getMonth();
          monthlyCounts[month]++;
        }
      });

      const chartData = Object.entries(monthlyCounts).map(([month, count]) => ({
        name: monthNames[parseInt(month)],
        month: parseInt(month) + 1,
        kunjungan: count,
      }));

      setYearData(chartData);
      setTotalVisitors(chartData.reduce((sum, item) => sum + item.kunjungan, 0));
    } catch (error) {
      console.error("Error loading year data:", error);
    } finally {
      setLoading(false);
    }
  }, [currentYear]);

  useEffect(() => {
    loadYearData();
  }, [loadYearData]);

  const goToPreviousYear = () => {
    setCurrentYear(currentYear - 1);
  };

  const goToNextYear = () => {
    setCurrentYear(currentYear + 1);
  };

  const goToCurrentYear = () => {
    setCurrentYear(new Date().getFullYear());
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Statistik Tahunan</h1>
        <p className="text-muted-foreground">Visualisasi data pengunjung per bulan</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPreviousYear}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={goToNextYear}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={goToCurrentYear}>
            Tahun Ini
          </Button>
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Tahun {currentYear}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Total Pengunjung Tahun {currentYear}
            </CardTitle>
            <CardDescription>Jumlah total pengunjung perpustakaan</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">{totalVisitors}</p>
            <p className="text-sm text-muted-foreground mt-2">pengunjung</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Grafik Bulanan</CardTitle>
            <CardDescription>Kunjungan per bulan tahun {currentYear}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={yearData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="kunjungan" fill="hsl(var(--primary))" name="Kunjungan" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grafik Tahunan Detail</CardTitle>
          <CardDescription>Visualisasi lengkap kunjungan per bulan</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={yearData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="kunjungan" fill="hsl(var(--primary))" name="Jumlah Kunjungan" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyStatistics;
