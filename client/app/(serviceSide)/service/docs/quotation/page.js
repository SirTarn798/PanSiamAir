"use client";

import { useEffect, useState } from "react";
import QuotationList from "@/app/component/quotationList";

export default function QuitationPage() {
  const [reqState, setReqState] = useState(1);
  const [quotations, setQuotations] = useState();

  const getQuotations = async (state, type) => {
    setReqState(state);
    try {
      const response = await fetch("/api/getQuotations", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          type,
        }),
      });
      if (response.status === 201) {
        const data = await response.json();
        setQuotations(data.requestProblems);
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getQuotations(1, "accepted_wait_write_quotation");
  }, []);

  return (
    <div className="flex flex-col gap-10 w-screen h-screen p-10">
      <p className="text-4xl font-bold">ใบเสนอราคา</p>
      <div className="flex gap-20 text-lg">
        <p
          className={
            "p-4 hover:bg-primary rounded-full cursor-pointer font-bold " +
            (reqState === 1 ? "bg-primary" : "")
          }
          onClick={() => getQuotations(1, "accepted_wait_write_quotation")}
        >
          รอการออกใบเสนอราคา
        </p>
        <p
          className={
            "p-4 hover:bg-primary rounded-full cursor-pointer font-bold " +
            (reqState === 2 ? "bg-primary" : "")
          }
          onClick={() => getQuotations(2, "accepted_wait_leader_quotation")}
        >
          รอการอนุมัติจาก Head
        </p>
        <p
          className={
            "p-4 hover:bg-primary rounded-full cursor-pointer font-bold " +
            (reqState === 3 ? "bg-primary" : "")
          }
          onClick={() => getQuotations(3, "accpeted_wait_cus_quotation")}
        >
          รอการอนุมัติจากลูกค้า
        </p>
        <p
          className={
            "p-4 hover:bg-primary rounded-full cursor-pointer font-bold " +
            (reqState === 4 ? "bg-primary" : "")
          }
          onClick={() => getQuotations(4, "finished")}
        >
          เสร็จสิ้น
        </p>
      </div>
      <div className="flex flex-col gap-3">
      <div className="grid grid-cols-[3fr_3fr_3fr_2fr_1fr_2fr] grid-rows-1 bg-primaryBg rounded-3xl p-3 font-bold">
          <p>เลขที่ใบขอรับบริการ</p>
          <p>วันที่ออกใบขอรับบริการ</p>
          <p>หมายเลขเครื่อง</p>
          <p>รุ่น</p>
          <p>เอกสาร</p>
          <p></p>
        </div>
        {quotations?.map((quotation) => {
          return <QuotationList quotation={quotation} key={quotation.RP_Id}/>;
        })}
      </div>
    </div>
  );
}
