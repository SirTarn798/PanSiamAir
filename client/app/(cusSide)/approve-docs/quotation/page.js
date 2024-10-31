"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function ApproveQuotation() {
  const searchParams = useSearchParams();
  const serial = searchParams.get("serial");
  const id = useSelector((state) => state.user.id);
  const [status, setStatus] = useState(null);
  const [data, setData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getACInfo = async () => {
      try {
        const response = await fetch("/api/authAC", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            serial,
          }),
        });
        if (response.status === 201) {
          setStatus(true);
          return true; // Indicate success
        } else {
          throw new Error("AC not found");
        }
      } catch (err) {
        setStatus(false);
        console.error("Error in getACInfo:", err.message);
        return false; // Indicate failure
      }
    };

    const getQuotation = async () => {
      try {
        const response = await fetch("/api/getQuotationFromACSerial", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            serial,
          }),
        });
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error in getQuotation:", error.message);
      }
    };

    const executeSequentially = async () => {
      const acInfoSuccess = await getACInfo();
      if (acInfoSuccess) {
        await getQuotation();
      }
    };

    executeSequentially();
  }, [serial, id]);

  const handleApprove = async (status) => {
    const confirmProceed = window.confirm(
      "ท่านแน่ใจหรือไม่ว่าต้องการ " + (status ? "ยืนยัน" : "ไม่ยืนยัน")
    );
    if (!confirmProceed) {
      return;
    }
    try {
      const response = await fetch("/api/cusApproveQuotation", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          serial,
          status,
        }),
      });

      if (response.status === 200) {
        alert("ดำนเนินการสำเร็จ");
        router.push("/");
      } else {
        throw new Error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  if (!status) {
    return (
      <div className="flex flex-col w-screen h-screen pl-16 pt-5 pr-3 items-center justify-center">
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
          <p>หมายเลขใบขอเสนอราคา : {data?.quotation.Q_Id}</p>
          <p>ราคารวม : {data?.quotation.Q_Total}</p>
          <p>ส่วนลด : {data?.quotation.Q_Discount}</p>
          <p>ภาษีมูลค่าเพิ่ม : {data?.quotation.Q_Vat}</p>
          <p>ราคาสุทธิ : {data?.quotation.Q_Grand_total}</p>
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
            {data?.quotation.Spare_detail.map((item, index) => (
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
          <button
            className="bg-gray-500 text-white font-bold rounded-3xl p-3"
            onClick={() => handleApprove(false)}
          >
            ไม่ยืนยัน
          </button>
        </div>
      </div>
    );
  }
}
