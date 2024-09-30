"use client";

import { useEffect, useState } from "react";

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
        console.log(data.requestProblems)
        setQuotations(data.requestProblems);
      } else {
        throw new Error(response.error)
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
            "p-4 hover:bg-primary rounded-full cursor-pointer " +
            (reqState === 1 ? "bg-primary" : "")
          }
          onClick={() => getQuotations(1, "accepted_wait_write_quotation")}
        >
          รอการออกใบเสนอราคา
        </p>
        <p
          className={
            "p-4 hover:bg-primary rounded-full cursor-pointer " +
            (reqState === 2 ? "bg-primary" : "")
          }
          onClick={() => getQuotations(2, "accepted_wait_leader_quotation")}
        >
          รอการอนุมัติจาก Head
        </p>
        <p
          className={
            "p-4 hover:bg-primary rounded-full cursor-pointer " +
            (reqState === 3 ? "bg-primary" : "")
          }
          onClick={() => getQuotations(3, "accpeted_wait_cus_quotation")}
        >
          รอการอนุมัติจากลูกค้า
        </p>
        <p
          className={
            "p-4 hover:bg-primary rounded-full cursor-pointer " +
            (reqState === 4 ? "bg-primary" : "")
          }
          onClick={() => getQuotations(4, "finished")}
        >
          เสร็จสิ้น
        </p>
      </div>
    </div>
  );
}
