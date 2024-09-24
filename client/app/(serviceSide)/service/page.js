"use client";

import { useState } from "react";

export default function Service() {
  const [reqState, setReqState] = useState(1);

  const getRequest = async (state, type) => {
    setReqState(state);
    try {
      const response = await fetch("getRequests", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          type,
        }),
      });
    } catch (error) {
      console.log(err.message);
    }
  };

  return (
    <div className="flex flex-col gap-10 w-screen h-screen p-10">
      <p className="text-4xl font-bold">รายการแจ้งซ่อม</p>
      <div className="flex gap-20 text-lg">
        <p
          className={
            "p-4 hover:bg-primary rounded-full cursor-pointer " +
            (reqState === 1 ? "bg-primary" : "")
          }
          onClick={() => getRequest(1, "wait")}
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
    </div>
  );
}
