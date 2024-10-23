"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function QuotationPage() {
  const searchParams = useSearchParams();
  const rf_id = searchParams.get("rf_id");
  const [error, setError] = useState(null);
  const [quotation, setQuotation] = useState();
  const router = useRouter();

  useEffect(() => {
    const getQuotation = async () => {
      try {
        const response = await fetch("/api/getQuotationFromRF", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            rf_id,
          }),
        });
        const data = await response.json();
        if (response.status === 200) {
          setQuotation(data.quotation);
        } else {
          setError(data.error);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    getQuotation();
  }, [id]);

  const handleApprove = async (status) => {
    const confirmProceed = window.confirm("ท่านแน่ใจหรือไม่ว่าต้องการ " + (status ? "อนุมัติ" : "ไม่อนุมัติ"));
    if (!confirmProceed) {
      return;
    }

    try {
      const response = await fetch("/api/headApproveQuotation", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          id,
          status,
        }),
      });

      if (response.status === 200) {
        alert("การอนุมัติสำเร็จ");
        router.push("/head/approve-docs");
      } else {
        throw new Error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col w-screen p-16 bg-primaryBg m-10 rounded-3xl gap-10">
      <div className="flex flex-col gap-3 font-bold">
        <p>หมายเลขใบขอเสนอราคา : {quotation?.Q_Id}</p>
        <p>ราคารวม : {quotation?.Q_Total}</p>
        <p>ส่วนลด : {quotation?.Q_Discount}</p>
        <p>ภาษีมูลค่าเพิ่ม : {quotation?.Q_Vat}</p>
        <p>ราคาสุทธิ : {quotation?.Q_Grand_total}</p>
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
          {quotation?.Spare_detail.map((item, index) => (
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
          อนุมัติ
        </button>
        <button
          className="bg-gray-500 text-white font-bold rounded-3xl p-3"
          onClick={() => handleApprove(false)}
        >
          ไม่อนุมัติ
        </button>
      </div>
    </div>
  );
}
