"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateReceipt() {
  const searchParams = useSearchParams();
  const [request, setRequest] = useState();
  const [error, setError] = useState(null);
  const rf_id = searchParams.get("RF_Id") || "";
  const router = useRouter();

  useEffect(() => {
    const getRequest = async () => {
      try {
        const response = await fetch("/api/getPaymentRequest", {
          //GET RP ID AS WELL
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            rf_id,
          }),
        });
        if (response.status === 201) {
          const data = await response.json();
          setRequest(data.request);
        } else {
          throw new Error(response.error);
        }
      } catch (error) {
        setError(true);
        console.log(error.message);
      }
    };
    getRequest();
  }, [rf_id]);

  const approvePayment = async () => {
    try {
      const response = await fetch("/api/approvePayment", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          status : true,
          rf_id,
        }),
      }
    );
    if(response.status === 200) {
      alert("ยืนยันสำเร็จ");
      router.push("/");
    }
    } catch (error) {
      console.log(error.message);
    }
  };

  const disapprovePayment = async () => {
    try {
      const response = await fetch("/api/approvePayment", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          status : false,
          rf_id,
        }),
      });
      if(response.status === 200) {
        alert("ยกเลิกสำเร็จ");
        router.push("/");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  if (error) {
    return (
      <div className="flex flex-col w-screen h-screen pl-16 pt-5 pr-3 items-center justify-center cursor-not-allowed">
        <p className="text-white bg-primary p-4">{"!! " + error + " !!"}</p>
      </div>
    );
  }
  if (request)
    return (
      <div className="w-screen flex flex-col items-center">
        <div className="flex flex-col rounded-t p-5 bg-primaryBg mt-1 mx-5 w-9/12 h-fit gap-5">
          <p className="font-bold text-2xl">
            ข้อมูลการชำระเงิน หมายเลขใบขอรับบริการ {request.RF_Id}
          </p>
          <div className="grid grid-cols-2 grid-rows-5 gap-x-40 gap-y-5 w-fit">
            <p className="font-bold">ชื่อ - สกุล</p>
            <p>{request.PR_Name}</p>
            <p className="font-bold">ธนาคาร</p>
            <p>{request.PR_Bank}</p>
            <p className="font-bold">วัน/เวลา</p>
            <p>{request.PR_Date}</p>
            <p className="font-bold">จำนวนเงิน</p>
            <p>{request.PR_Price}</p>
            <p className="font-bold">หลักฐานการชำระเงิน</p>
          </div>
          <img src={request.PR_Pic} alt="หลักฐานการชำระเงิน" />
          <div className="flex gap-3">
            <button
              className="bg-primary text-white font-bold p-3 rounded"
              onClick={approvePayment}
            >
              ยืนยัน
            </button>
            <button
              className="bg-white text-black font-bold p-3 rounded"
              onClick={disapprovePayment}
            >
              ไม่ยืนยัน
            </button>
          </div>
        </div>
      </div>
    );
}
