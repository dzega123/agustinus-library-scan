import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToExcel = (data: any[], filename: string) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

export const exportMembersToPDF = (members: any[]) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(16);
  doc.text('STT REFORMED INJILI INTERNASIONAL', 105, 15, { align: 'center' });
  doc.setFontSize(14);
  doc.text('PERPUSTAKAAN AGUSTINUS', 105, 22, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Daftar Anggota Perpustakaan', 105, 29, { align: 'center' });
  
  // Table
  autoTable(doc, {
    startY: 35,
    head: [['ID Anggota', 'Nama', 'Tipe Keanggotaan', 'Institusi', 'Tanggal Daftar']],
    body: members.map(m => [
      m.idAnggota,
      m.nama,
      m.tipeKeanggotaan,
      m.institusi,
      new Date(m.registeredAt).toLocaleDateString('id-ID')
    ]),
  });
  
  doc.save('Daftar_Anggota.pdf');
};

export const exportVisitorsToPDF = (visitors: any[], startDate?: string, endDate?: string) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(16);
  doc.text('STT REFORMED INJILI INTERNASIONAL', 105, 15, { align: 'center' });
  doc.setFontSize(14);
  doc.text('PERPUSTAKAAN AGUSTINUS', 105, 22, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Data Pengunjung Perpustakaan', 105, 29, { align: 'center' });
  
  if (startDate && endDate) {
    doc.setFontSize(10);
    doc.text(`Periode: ${startDate} s/d ${endDate}`, 105, 36, { align: 'center' });
  }
  
  // Table
  autoTable(doc, {
    startY: startDate && endDate ? 42 : 35,
    head: [['Nama', 'Tipe', 'Tanggal', 'Waktu']],
    body: visitors.map(v => [
      v.nama,
      v.type,
      new Date(v.timestamp).toLocaleDateString('id-ID'),
      new Date(v.timestamp).toLocaleTimeString('id-ID')
    ]),
  });
  
  doc.save('Data_Pengunjung.pdf');
};

export const printMembers = (members: any[]) => {
  const printWindow = window.open('', '', 'height=600,width=800');
  if (!printWindow) return;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Daftar Anggota</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1, h2, h3 { text-align: center; margin: 5px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          @media print {
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>STT REFORMED INJILI INTERNASIONAL</h1>
        <h2>PERPUSTAKAAN AGUSTINUS</h2>
        <h3>Daftar Anggota Perpustakaan</h3>
        <table>
          <thead>
            <tr>
              <th>ID Anggota</th>
              <th>Nama</th>
              <th>Tipe Keanggotaan</th>
              <th>Institusi</th>
              <th>Tanggal Daftar</th>
            </tr>
          </thead>
          <tbody>
            ${members.map(m => `
              <tr>
                <td>${m.idAnggota}</td>
                <td>${m.nama}</td>
                <td>${m.tipeKeanggotaan}</td>
                <td>${m.institusi}</td>
                <td>${new Date(m.registeredAt).toLocaleDateString('id-ID')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
    </html>
  `;
  
  printWindow.document.write(html);
  printWindow.document.close();
};

export const exportThesisAttendanceToPDF = (
  attendances: any[],
  startDate: string,
  endDate: string
) => {
  const doc = new jsPDF('landscape');
  
  // Header
  doc.setFontSize(14);
  doc.text('Laporan Kunjungan Mahasiswa Skripsi dan Tesis', 148, 15, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Perpustakaan Agustinus', 148, 22, { align: 'center' });
  doc.setFontSize(10);
  doc.text('Semester Genap Tahun Ajaran 2024/2025', 148, 28, { align: 'center' });
  doc.text(`Tanggal ${startDate} - ${endDate}`, 148, 34, { align: 'center' });
  
  // Prepare data by student and day
  const studentData = new Map();
  
  attendances.forEach(att => {
    if (!studentData.has(att.studentId)) {
      studentData.set(att.studentId, {
        nama: att.nama,
        senin: { masuk: '', keluar: '' },
        selasa: { masuk: '', keluar: '' },
        rabu: { masuk: '', keluar: '' },
        kamis: { masuk: '', keluar: '' },
        jumat: { masuk: '', keluar: '' },
        totalJam: 0
      });
    }
    
    const student = studentData.get(att.studentId);
    const date = new Date(att.checkInTime);
    const dayName = date.toLocaleDateString('id-ID', { weekday: 'long' }).toLowerCase();
    
    if (att.checkInTime) {
      student[dayName].masuk = new Date(att.checkInTime).toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    if (att.checkOutTime) {
      student[dayName].keluar = new Date(att.checkOutTime).toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      // Calculate hours
      const hours = (new Date(att.checkOutTime).getTime() - new Date(att.checkInTime).getTime()) / (1000 * 60 * 60);
      student.totalJam += hours;
    }
  });
  
  // Table
  const tableData = Array.from(studentData.values()).map((s, idx) => [
    idx + 1,
    s.nama,
    s.senin.masuk, s.senin.keluar,
    s.selasa.masuk, s.selasa.keluar,
    s.rabu.masuk, s.rabu.keluar,
    s.kamis.masuk, s.kamis.keluar,
    s.jumat.masuk, s.jumat.keluar,
    s.totalJam.toFixed(2)
  ]);
  
  autoTable(doc, {
    startY: 40,
    head: [[
      { content: 'No', rowSpan: 2 },
      { content: 'Nama', rowSpan: 2 },
      { content: 'SENIN', colSpan: 2 },
      { content: 'SELASA', colSpan: 2 },
      { content: 'RABU', colSpan: 2 },
      { content: 'KAMIS', colSpan: 2 },
      { content: 'JUMAT', colSpan: 2 },
      { content: 'Total Jam', rowSpan: 2 }
    ], [
      'Masuk', 'Keluar',
      'Masuk', 'Keluar',
      'Masuk', 'Keluar',
      'Masuk', 'Keluar',
      'Masuk', 'Keluar'
    ]],
    body: tableData,
    styles: { 
      fontSize: 8,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
      textColor: [0, 0, 0],
      fillColor: [255, 255, 255]
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
      halign: 'center',
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 40, halign: 'left' },
      2: { cellWidth: 15, halign: 'center' },
      3: { cellWidth: 15, halign: 'center' },
      4: { cellWidth: 15, halign: 'center' },
      5: { cellWidth: 15, halign: 'center' },
      6: { cellWidth: 15, halign: 'center' },
      7: { cellWidth: 15, halign: 'center' },
      8: { cellWidth: 15, halign: 'center' },
      9: { cellWidth: 15, halign: 'center' },
      10: { cellWidth: 15, halign: 'center' },
      11: { cellWidth: 15, halign: 'center' },
      12: { cellWidth: 20, halign: 'center' }
    }
  });
  
  doc.save('Laporan_Mahasiswa_Skripsi_Tesis.pdf');
};
