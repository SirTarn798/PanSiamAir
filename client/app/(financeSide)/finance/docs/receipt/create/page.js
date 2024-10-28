"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateReceipt() {
  const searchParams = useSearchParams();
  const [request, setRequest] = useState(null);
  const [rf, setRF] = useState(null);
  const [error, setError] = useState(null);
  const rf_id = searchParams.get("RF_Id") || "";
  const router = useRouter();

  useEffect(() => {
    const getPaymentRequest = async () => {
      try {
        const response = await fetch("/api/getPaymentRequest", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            rf_id,
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch payment request');
        }
        
        const data = await response.json();
        setRequest(data.request);
      } catch (error) {
        setError(error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลการชำระเงิน');
        console.error('Payment request error:', error);
      }
    };

    const getRequestForm = async () => {
      try {
        const response = await fetch("/api/getRequestFormInfo", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            id: rf_id,
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch request form');
        }
        
        const data = await response.json();
        setRF(data.requests);
        console.log(data.requests)
      } catch (error) {
        setError(error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลคำขอ');
        console.error('Request form error:', error);
      }
    };

    getPaymentRequest();
    getRequestForm();
  }, [rf_id]);

  const handlePaymentAction = async (status) => {
    try {
      const response = await fetch("/api/approvePayment", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          status,
          rf_id,
          rp_id: request.RP_Id,
          serial: request.AC_Serial,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process payment action');
      }

      alert(status ? "ยืนยันสำเร็จ" : "ยกเลิกสำเร็จ");
      router.push("/");
    } catch (error) {
      setError(error.message || 'เกิดข้อผิดพลาดในการดำเนินการ');
      console.error('Payment action error:', error);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col w-screen h-screen pl-16 pt-5 pr-3 items-center justify-center">
        <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg">
          <p className="font-bold">เกิดข้อผิดพลาด</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex flex-col w-screen h-screen pl-16 pt-5 pr-3 items-center justify-center">
        <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

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
        <img 
          src={request.PR_Pic} 
          alt="หลักฐานการชำระเงิน" 
          width={400}
          className="rounded-lg shadow-md" 
        />
        <div className="flex gap-3">
          <button
            className="bg-primary text-white font-bold p-3 rounded hover:opacity-90 transition-opacity"
            onClick={() => handlePaymentAction(true)}
          >
            ยืนยัน
          </button>
          <button
            className="bg-white text-black font-bold p-3 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
            onClick={() => handlePaymentAction(false)}
          >
            ไม่ยืนยัน
          </button>
        </div>
        <p className="font-bold text-2xl">
          ข้อมูลใบขอรับบริการ {request.RF_Id}
        </p>
        <div className="grid grid-cols-2 grid-rows-5 gap-x-40 gap-y-5 w-fit">
          <p className="font-bold">ชื่อเจ้าของแอร์</p>
          <p>{rf?.AC.Customer.U_Name}</p>
          <p className="font-bold">รุ่นแอร์</p>
          <p>{rf?.AC.AC_Model}</p>
          <p className="font-bold">รหัสแอร์</p>
          <p>{rf?.AC.AC_Serial}</p>
          <p className="font-bold">อาการ</p>
          <p>{rf?.RP_Detail}</p>
          <p className="font-bold">สาเหตุ</p>
          <p>{rf?.RF_Cause}</p>
          <p className="font-bold">วิธีการซ่อม</p>
          <p>{rf?.RF_Repair_details}</p>
        </div>
      </div>
    </div>
  );
}