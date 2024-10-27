"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateDistributeVoucher() {
  const searchParams = useSearchParams();
  const rf_id = searchParams.get("RF_Id");
  const [status, setStatus] = useState(true);
  const [data, setData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getRequisition = async () => {
      try {
        const response = await fetch("/api/getRequisitionFromRF", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            rf_id,
          }),
        });
        if(!response.ok) {
          throw new Error()
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        setStatus(false)
        console.error("Error in getQuotation:", error.message);
      }
    };
    getRequisition();
  }, [rf_id]);

  const handleApprove = async (status) => {
    const confirmProceed = window.confirm(
      "ท่านแน่ใจหรือไม่ว่าต้องการ " + (status ? "ยืนยัน" : "ไม่ยืนยัน")
    );
    if (!confirmProceed) {
      return;
    }
    try {
      const response = await fetch("/api/createDistributeVoucher", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          rf_id,
        }),
      });

      if (response.status === 200) {
        alert("ดำเนินการสำเร็จ");
        router.push("/service/docs/distribute-voucher");
      } else {
        throw new Error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  if (!status) {
    return (
      <div className="flex flex-col w-screen h-screen pl-16 pt-5 pr-3 items-center justify-center cursor-not-allowed">
        <p className="text-white bg-primary p-4">
          !! ข้อมูลที่กรอกไม่ถูกต้อง คุณไม่มีสิทธิ์จัดการแอร์ตัวนี้
          ระบบอาจมีปัญหา หรือแอร์กำลังอยู่ในกระบวนการซ่อม กรุณาลองอีกครั้ง !!
        </p>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col w-screen p-16 bg-primaryBg m-10 rounded-3xl gap-10">
        <div className="flex flex-col gap-3 font-bold">
          <p>หมายเลขใบเบิกอะไหล่ : {data?.requisition.RE_Id}</p>
          <p>ช่างผู้ออก : {data?.requisition.U_Name}</p>
          <p>
            วันที่ออก :{" "}
            {new Date(data?.requisition.RE_Date).toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
            })}
          </p>
        </div>
        <table className="w-full border-collapse rounded-lg overflow-hidden p-5">
          <thead>
            <tr className="font-bold bg-zinc-800 text-white">
              <td className="p-3">สินค้า</td>
              <td className="p-3">จำนวน</td>
              <td className="p-3">ราคาต่อหน่วย</td>
              <td className="p-3">มูลค่า</td>
              <td className="p-3">
                <img src="/settings.png" alt="setting" width={20} height={20} />
              </td>
            </tr>
          </thead>
          <tbody>
            {data?.requisition.Spare_detail.map((item, index) => (
              <tr
                key={index}
                className={`odd:bg-gray-100 even:bg-gray-200`} // Alternating row colors
              >
                <td className="p-3">{item.Spare.S_Name}</td>
                <td className="p-3">
                  <span className="px-2">{item.SD_Quantity}</span>
                </td>
                <td className="p-3">{item.Spare.S_Price}</td>
                <td className="p-3">
                  {(item.Spare.S_Price * item.SD_Quantity).toFixed(2)}
                </td>
                <td className="p-3"></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex gap-14">
          <button
            className="bg-primary text-white font-bold rounded-3xl p-3"
            onClick={() => handleApprove(true)}
          >
            ยืนยัน
          </button>
          
        </div>
      </div>
    );
  }
}
