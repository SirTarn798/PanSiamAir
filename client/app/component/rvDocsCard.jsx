"use client";

import { useRouter } from "next/navigation";

export default function RVDocsCard(props) {
  const router = useRouter();
  
  const handleApproveReceiveVoucher = async () => {
    try {
      const response = await fetch("/api/approveReceiveVoucher", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          rv_id: props.voucher.RV_Id,
        }),
      });
      
      if (response.status === 200) {
        alert("ยืนยันสำเร็จ");
        router.push("/store");
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <div className="flex flex-col gap-5 bg-primaryBg p-5 rounded-lg w-6/12">
      <h1 className="font-bold">ใบขอรับบริการ {props.voucher.RF_Id}</h1>
      <h1 className="font-bold">ใบสำคัญรับ {props.voucher.RV_Id}</h1>
      <h1 className="font-bold">วันที่ {props.voucher.RV_Date}</h1>
      <div className="m-2 p-2 bg-primary w-full rounded">
        {props.voucher.Spare_detail.map((item, index) => (
          <div 
            key={index} 
            className={`flex justify-between p-2 ${
              index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
            }`}
          >
            <h1 className="font-bold">{item.Spare.S_Name}</h1>
            <h1 className="font-medium">จำนวน: {item.SD_Quantity}</h1>
          </div>
        ))}
      </div>
      {!props.voucher.RV_Approve && (
        <button
          className="bg-primary p-3 rounded-3xl w-fit font-bold"
          onClick={handleApproveReceiveVoucher}
        >
          ยืนยันใบสำคัญรับ
        </button>
      )}
    </div>
  );
}