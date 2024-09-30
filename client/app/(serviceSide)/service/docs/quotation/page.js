"use client";

import { useState } from "react";
import QuotationList from "@/app/component/quotationList"; // Server component

export default function QuotationPage() {
  const [type, setType] = useState(1);

  return (
    <div className="flex flex-col gap-10 w-screen h-screen p-10">
      <p className="text-4xl font-bold">รายการแจ้งซ่อม</p>
      <div className="flex gap-20 text-lg">
        <p
          className={
            "p-4 hover:bg-primary rounded-full cursor-pointer " + "bg-primary"
          }
        >
          รอการยืนยัน
        </p>
        <p
          className={"p-4 hover:bg-primary rounded-full cursor-pointer "}
        >
          ยืนยันการซ่อม
        </p>
        <p
          className={"p-4 hover:bg-primary rounded-full cursor-pointer "}
        >
          ดำเนินการเสร็จสิ้น
        </p>
      </div>
      <QuotationList type={type} /> {/* Server component */}
    </div>
  );
}
