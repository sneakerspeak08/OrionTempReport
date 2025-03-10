import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function ReportsPage() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      const { data, error } = await supabase
        .from("Reports") 
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching reports:", error);
      } else {
        console.log("Data:", data);
        setReports(data);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="container">
      <h1>All User Reports</h1>
      <div className="reports-grid">
        {reports.length > 0 ? (
          reports.map((report) => (
            <div key={report.id} className="report-card">
              <h2>{report.location}</h2>
              <p><strong>Temperature:</strong> {report.temperature}°F</p>
              <p><strong>Reported At:</strong> {new Date(report.created_at).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p>No reports found</p>
        )}
      </div>
    </div>
  );
}
