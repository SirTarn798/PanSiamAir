"use client"

import { useEffect, useState } from "react";
import CausesReport from "../../../../component/causesReport";

export default function ReportCauses() {
  const [causes, setCauses] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getReport = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/getAcCauses`,
          {
            method: "GET",
            headers: {
              "content-type": "application/json",
            },
          }
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setCauses(data.causes);
      } catch (err) {
        console.error('Error fetching causes:', err);
        setError(err.message);
        setCauses([]);
      }
    };
    
    getReport();
  }, []);

  if (error) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="text-red-500">เกิดข้อผิดพลาด: {error}</div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen">
      <CausesReport causes={causes} />
    </div>
  );
}