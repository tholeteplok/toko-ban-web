// Report.js - versi untuk HTML biasa
const SUPABASE_URL = "https://ewxmmyfuexexyczkcyfb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3eG1teWZ1ZXhleHljemtjeWZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxMzk1NzIsImV4cCI6MjA2MDcxNTU3Mn0.2BwviZ4DRFyEkTNxi0dPLbQQimTW_nywRxM_CSxvBcU";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Contoh fungsi untuk ambil laporan harian
async function fetchDailyReport(startDate, endDate) {
  const { data, error } = await supabase
    .from('transactions')
    .select('created_at, total')
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Error mengambil data:", error.message);
    return;
  }

  const grouped = data.reduce((acc, transaction) => {
    const date = new Date(transaction.created_at).toLocaleDateString();
    acc[date] = (acc[date] || 0) + transaction.total;
    return acc;
  }, {});

  const result = Object.entries(grouped).map(([date, total]) => ({ date, total }));
  console.log("Laporan harian:", result);
  return result;
}

// Contoh penggunaan:
const start = new Date("2024-01-01").toISOString();
const end = new Date("2024-12-31").toISOString();
fetchDailyReport(start, end);
