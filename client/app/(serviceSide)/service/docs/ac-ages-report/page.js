"use client"

import { useEffect, useState } from "react";
import AgesReport from "../../../../component/agesReport";


export default function ReportAges() {
  const [ages, setAges] = useState(null)
  useEffect(() => {
    const getReport = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/getAcAges`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
        }
      );
      const data = await response.json();
      setAges(data.ages);
    };
    getReport()
  }, []);
  return (
    <div className="w-screen h-screen">
      <AgesReport ages={ages} />
    </div>
  );
}
