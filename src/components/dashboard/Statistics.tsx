import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Statistics = () => {
  const [weekData, setWeekData] = useState<any[]>([]);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getMonday(new Date()));
  const [totalVisitors, setTotalVisitors] = useState(0);

  function getMonday(date: Date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  useEffect(() => {
    loadWeekData();
  }, [currentWeekStart]);

  const loadWeekData = async () => {
    const weekStart = new Date(currentWeekStart);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const { data } = await supabase
      .from('check_ins')
      .select('date, created_at')
      .gte('date', weekStart.toISOString().split('T')[0])
      .lt('date', weekEnd.toISOString().split('T')[0])
      .order('date');

    // Group by day
    const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    const dayCounts: { [key: string]: number } = {};
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      dayCounts[dateStr] = 0;
    }

    data?.forEach(item => {
      if (item.date && dayCounts[item.date] !== undefined) {
        dayCounts[item.date]++;
      }
    });

    const chartData = Object.entries(dayCounts).map(([date, count], index) => ({
      name: dayNames[index],
      date: date,
      kunjungan: count,
    }));

    setWeekData(chartData);
    setTotalVisitors(data?.length || 0);
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const goToCurrentWeek = () => {
    setCurrentWeekStart(getMonday(new Date()));
  };

  const formatDateRange = () => {
    const start = new Date(currentWeekStart);
    const end = new Date(currentWeekStart);
    end.setDate(end.getDate() + 6);
    
    return `${start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Grafik & Statistik</h1>
        <p className="text-muted-foreground">Visualisasi data pengunjung perpustakaan</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={goToNextWeek}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={goToCurrentWeek}>
            Minggu Ini
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {formatDateRange()}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Total Kunjungan Minggu Ini
            </CardTitle>
            <CardDescription>Jumlah pengunjung dalam periode yang dipilih</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{totalVisitors}</div>
            <p className="text-sm text-muted-foreground mt-2">pengunjung</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Grafik Kunjungan Harian
          </CardTitle>
          <CardDescription>Statistik kunjungan per hari dalam seminggu</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
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

export default Statistics;
