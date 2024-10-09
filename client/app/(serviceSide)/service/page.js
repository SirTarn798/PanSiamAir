"use client";

import { useEffect, useState } from "react";
import Request from "@/app/component/request";

export default function Service() {
  const [reqState, setReqState] = useState(1);
  const [requests, setRequests] = useState();

  const getRequest = async (state, type) => {
    setReqState(state);
    try {
      const response = await fetch("/api/getRequests", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          type,
        }),
      });
      const data = await response.json();
      setRequests(data.requests);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getRequest(1, "waiting");
  }, []);

  return (
    <div className="flex flex-col gap-10 w-screen h-screen p-10">
      <p className="text-4xl font-bold">รายการแจ้งซ่อม</p>
      <div className="flex gap-20 text-lg">
        <p
          className={
            "p-4 hover:bg-primary rounded-full cursor-pointer " +
            (reqState === 1 ? "bg-primary" : "")
          }
          onClick={() => getRequest(1, "waiting")}
        >
          รอการยืนยัน
        </p>
        <p
          className={
            "p-4 hover:bg-primary rounded-full cursor-pointer " +
            (reqState === 2 ? "bg-primary" : "")
          }
          onClick={() => getRequest(2, "accepted")}
        >
          ยืนยันการซ่อม
        </p>
        <p
          className={
            "p-4 hover:bg-primary rounded-full cursor-pointer " +
            (reqState === 3 ? "bg-primary" : "")
          }
          onClick={() => getRequest(3, "finished")}
        >
          ดำเนินการเสร็จสิ้น
        </p>
      </div>
      <div className="flex flex-col gap-5 w-full h-full overflow-y-auto">
        {requests?.map((request) => {
          return <Request request={request} key={request.RP_Id} />;
        })}
      </div>
    </div>
  );
}
