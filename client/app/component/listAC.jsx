import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import checkInsurance from "@/lib/checkInsurance";

const ListAC = (props) => {
  let ac = props.ac;
  let insurance = checkInsurance(ac.AC_Installation_date);
  const router = useRouter();
  const [date, setDate] = useState(null);

  useEffect(() => {
    const getAppointmentOfAC = async () => {
      if (ac.AC_Status === "อยู่ในขั้นตอนการซ่อม") {
        try {
          const response = await fetch("/api/getAppointmentOfAC", {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              AC_Serial: ac.AC_Serial,
            }),
          });
          const data = await response.json();
          setDate(data.appointment[0]);
          if (response.status != 200) {
            throw new Error("Fetch error");
          }
        } catch (error) {
          alert("มีข้อผิดพลาดในการแสดงวันนัด โปรดลองอีกครั้ง");
        }
      }
    };
    getAppointmentOfAC();
  }, []);

  const handleFixRequest = () => {
    if (ac.AC_Status === "สถานะปกติ") {
      router.push(`/fixing?serial=${ac.AC_Serial}`);
    } else if (ac.AC_Status === "รอยืนยันราคา") {
      router.push(`/approve-docs/quotation?serial=${ac.AC_Serial}`);
    } else if (ac.AC_Status === "รอเลือกวันนัดหมาย") {
      router.push(`/pick-calendar?serial=${ac.AC_Serial}`);
    } else if (ac.AC_Status === "รอการเลือกวันใหม่อีกครั้ง") {
      router.push(`/pick-calendar?serial=${ac.AC_Serial}&reschedule=true`);
    } else if (ac.AC_Status === "รอยืนยันใบขอรับบริการ") {
      router.push(`/approve-docs/request-form?serial=${ac.AC_Serial}&reschedule=true`);
    } else if (ac.AC_Status === "อัปโหลดหลักฐานการชำระเงิน") {
      router.push(`/payment?serial=${ac.AC_Serial}`);
    }
  };

  const status = {
    สถานะปกติ: "bg-primary cursor-pointer",
    รอพิจารณาซ่อม: "bg-black text-white cursor-not-allowed",
    รอทางบริษัทเสนอราคา: "bg-black text-white cursor-not-allowed",
    รอยืนยันราคา: "bg-black text-white cursor-pointer",
    รอเลือกวันนัดหมาย: "bg-black text-white cursor-pointer",
    อยู่ในขั้นตอนการซ่อม: "bg-black text-white cursor-not-allowed",
    รอการเลือกวันใหม่อีกครั้ง: "bg-black text-white cursor-pointer",
    รอยืนยันใบขอรับบริการ: "bg-black text-white cursor-pointer",
    อัปโหลดหลักฐานการชำระเงิน: "bg-black text-white cursor-pointer",
    "ซ่อมสำเร็จ รอกระบวนการเสร็จสิ้น": "bg-black text-white cursor-not-allowed",
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="grid grid-cols-5 grid-rows-1 p-3 items-center">
      <p>{ac.AC_Serial}</p>
      <p>{ac.AC_Model}</p>
      <p>{ac.AC_Address}</p>
      <p className={`font-bold ${insurance ? "text-emerald-600" : "text-rose-700"}`}>
        {insurance ? "อยู่ในประกัน" : "ไม่อยู่ในประกัน"}
      </p>
      <div className="relative group">
        <p className={`rounded-lg w-fit p-2 ${status[ac.AC_Status]}`} onClick={handleFixRequest}>
          {ac.AC_Status === "อยู่ในขั้นตอนการซ่อม" ? "ดูวันนัด" : ac.AC_Status}
        </p>
        {ac.AC_Status === "อยู่ในขั้นตอนการซ่อม" && date && (
          <div className="absolute hidden group-hover:block z-10 bg-gray-800 text-white p-3 rounded-lg shadow-lg top-full mt-1 left-0 min-w-64">
            <p className="text-sm mb-2">เวลาเริ่ม: {formatDate(date.s_start_time)}</p>
            <p className="text-sm">เวลาสิ้นสุด: {formatDate(date.s_end_time)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListAC;