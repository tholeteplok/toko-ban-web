// src/pages/Reports.jsx
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ewxmmyfuexexyczkcyfb.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3eG1teWZ1ZXhleHljemtjeWZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxMzk1NzIsImV4cCI6MjA2MDcxNTU3Mn0.2BwviZ4DRFyEkTNxi0dPLbQQimTW_nywRxM_CSxvBcU";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function Reports() {
  const [report, setReport] = useState([]);

  useEffect(() => {
    const fetchDailyReport = async () => {
      const start = new Date("2024-01-01").toISOString();
      const end = new Date("2024-12-31").toISOString();

      const { data, error } = await supabase
        .from("transactions")
        .select("created_at, total")
        .gte("created_at", start)
        .lte("created_at", end)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error mengambil data:", error.message);
        return;
      }

      const grouped = data.reduce((acc, transaction) => {
        const date = new Date(transaction.created_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + transaction.total;
        return acc;
      }, {});

      const result = Object.entries(grouped).map(([date, total]) => ({
        date,
        total,
      }));
      setReport(result);
    };

    fetchDailyReport();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Laporan Harian</h1>
      {report.length === 0 ? (
        <p className="text-gray-500">Memuat laporan...</p>
      ) : (
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Tanggal</th>
              <th className="border p-2 text-left">Total Transaksi</th>
            </tr>
          </thead>
          <tbody>
            {report.map(({ date, total }) => (
              <tr key={date}>
                <td className="border p-2">{date}</td>
                <td className="border p-2">Rp {total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
