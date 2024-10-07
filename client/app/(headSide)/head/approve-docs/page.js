"use client";

import { useEffect, useState } from "react";
import DocsCard from "@/app/component/docsCard";

export default function ApproveDocsPage() {
  const [docs, setDocs] = useState(null);

  useEffect(() => {
    const getHeadNeededDocs = async () => {
      try {
        const response = await fetch("/api/getHeadNeededDocs", {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
        });
        const data = await response.json();
        setDocs(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    getHeadNeededDocs();
  }, []);

  return (
    <div className="flex flex-col w-full h-full p-5">
      {docs && (
        <>
          {docs.quotations && docs.quotations.length > 0 && (
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold">ใบเสนอราคา</h2>
              <div className="flex gap-2 overflow-x-scroll overflow-y-hidden">
                {docs.quotations.map((quotation, index) => (
                  <div key={`quotation-${index}`} className="shrink-0">
                    <DocsCard quotation={quotation} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
  
}
