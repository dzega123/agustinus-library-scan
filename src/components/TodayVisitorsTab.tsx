import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface Visitor {
  id: string;
  nama: string;
  type: string;
  timestamp: string;
}

interface TodayVisitorsTabProps {
  visitors: Visitor[];
}

const TodayVisitorsTab = ({ visitors }: TodayVisitorsTabProps) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const time = date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const dateStr = date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    return { time, date: dateStr };
  };

  return (
    <div className="mt-8">
      <div className="bg-card rounded-lg shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">No</TableHead>
              <TableHead>Nama Pengunjung</TableHead>
              <TableHead>Tipe Keanggotaan</TableHead>
              <TableHead>Jam</TableHead>
              <TableHead>Tanggal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visitors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Belum ada pengunjung hari ini
                </TableCell>
              </TableRow>
            ) : (
              visitors.map((visitor, index) => {
                const { time, date } = formatTimestamp(visitor.timestamp);
                return (
                  <TableRow key={visitor.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{visitor.nama}</TableCell>
                    <TableCell>
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                        {visitor.type}
                      </span>
                    </TableCell>
                    <TableCell>{time}</TableCell>
                    <TableCell>{date}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TodayVisitorsTab;
