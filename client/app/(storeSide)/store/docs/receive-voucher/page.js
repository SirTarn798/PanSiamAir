"use client";

import { useEffect, useState } from "react";
import RVDocsCard from "../../../../component/rvDocsCard";

export default function ReceiveVoucherPage() {
  const [reqState, setReqState] = useState(1);
  const [vouchers, setVouchers] = useState();

  const getReceiveVouchers = async (state, type) => {
    setReqState(state);
    try {
      const response = await fetch("/api/getReceiveVouchers", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          type,
        }),
      });
      if (response.status === 200) {
        const data = await response.json();
        setVouchers(data.receiveVouchers);
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getReceiveVouchers(1, false);
  }, []);

  return (
    <div className="flex flex-col gap-10 w-screen h-screen p-10">
      <p className="text-4xl font-bold">ใบสำคัญรับ</p>
      <div className="flex gap-20 text-lg">
        <p
          className={
            "p-4 hover:bg-primary rounded-full cursor-pointer font-bold " +
            (reqState === 1 ? "bg-primary" : "")
          }
          onClick={() => getReceiveVouchers(1, false)}
        >
          รอยืนยันใบสำคัญรับ
        </p>
        <p
          className={
            "p-4 hover:bg-primary rounded-full cursor-pointer font-bold " +
            (reqState === 2 ? "bg-primary" : "")
          }
          onClick={() => getReceiveVouchers(2, true)}
        >
          เสร็จสิ้น
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {vouchers?.map((voucher) => {
          return <RVDocsCard key={voucher.RV_Id} voucher={voucher}/>;
        })}
      </div>
    </div>
  );
}
