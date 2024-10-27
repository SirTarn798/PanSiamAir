"use client";

import { useEffect, useState } from "react";
import RequestList from "@/app/component/requestList";

export default function QuotationPage() {
  const [reqState, setReqState] = useState(1);
  const [requests, setRequests] = useState();

  const getRequests = async (state, type) => {
    setReqState(state);
    try {
      const response = await fetch("/api/getRequestsOnStatus", {
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
        setRequests(data.requestProblems);
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getRequests(1, "accepted_wait_write_distribute_voucher");
  }, []);

  return (
    <div className="flex flex-col gap-10 w-screen h-screen p-10">
      <p className="text-4xl font-bold">ใบสำคัญจ่าย</p>
      <div className="flex gap-20 text-lg">
        <p
          className={
            "p-4 hover:bg-primary rounded-full cursor-pointer font-bold " +
            (reqState === 1 ? "bg-primary" : "")
          }
          onClick={() => getRequests(1, "accepted_wait_write_distribute_voucher")}
        >
          รอการออกใบสำคัญจ่าย
        </p>
        <p
          className={
            "p-4 hover:bg-primary rounded-full cursor-pointer font-bold " +
            (reqState === 2 ? "bg-primary" : "")
          }
          onClick={() => getRequests(2, "wait implement")}
        >
          ส่งให้แผนก Store แล้ว
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
        {requests?.map((request) => {
          return <RequestList request={request} key={request.RP_Id} />;
        })}
      </div>
    </div>
  );
}
