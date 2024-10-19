"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import checkInsurance from "@/lib/checkInsurance";
import { useSelector } from "react-redux";

export default function RequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [request, setRequest] = useState({ AC: { Customer: "" } });
  const [error, setError] = useState(null);
  const [insurance, setInsurance] = useState(false);
  const rf_id = searchParams.get("RF_Id") || "";
  const id = useSelector((state) => state.user.id);
  const [cause, setCause] = useState(null);
  const [fixDetail, setFixDetail] = useState(null);

  useEffect(() => {
    const getWork = async () => {
      try {
        const response = await fetch("/api/getMechWorkDetail", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            rf_id,
            id,
          }),
        });
        if (response.status === 200) {
          const data = await response.json();
          setRequest(data.requests);
          setInsurance(checkInsurance(data.requests.AC_Installation_date));
        } else if (response.status === 400) {
          throw new Error("ไม่สามารถเข้าถึงได้เนื่องจากรหัสคำขอซ่อมไม่ถูกต้อง");
        } else if (response.status === 500) {
          throw new Error("โปรดลองอีกครั้งเนื่องจากเซิฟเวอร์มีปัญหา");
        }
      } catch (error) {
        setError(error.message);
      }
    };
    getWork();
  }, [rf_id]);

  const finishWork = async () => {
    const confirmProceed = window.confirm(
      "ท่านแน่ใจหรือไม่ว่าต้องการยืนยันการซ่อม"
    );
    if (!confirmProceed) {
      return;
    }
    try {
      await fetch("/api/updateRequest", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          serial: request.AC.AC_Serial,
          id: request.RP_Id,
          statusAc: "รอยืนยันใบขอรับบริการ",
          statusRp: "accepted_wait_cus_request_form",
        }),
      });

      await fetch("/api/finishFixing", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          rf_id,
          cause,
          fixDetail,
        }),
      });

      router.push("/mechanic/work-list");
    } catch (error) {
      alert(error.message);
    }
  };

  const extendWork = async () => {
    const confirmProceed = window.confirm(
      'ท่านแน่ใจหรือไม่ว่าต้องการยืนยัน "ซ่อมไม่สำเร็จ" และทำนัดใหม่อีกครั้ง'
    );
    if (!confirmProceed) {
      return;
    }
    try {
      const response = await fetch("/api/updateRequest", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          serial: request.AC.AC_Serial,
          id: request.RP_Id,
          statusAc: "รอการเลือกวันใหม่อีกครั้ง",
          statusRp: "accepted_fail_wait_reschedule",
        }),
      });
      router.push("/mechanic/work-list");
    } catch (error) {
      alert(error.message);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col w-screen h-screen pl-16 pt-5 pr-3 items-center justify-center cursor-not-allowed">
        <p className="text-white bg-primary p-4">{"!! " + error + " !!"}</p>
      </div>
    );
  }
  return (
    <div className="w-screen flex flex-col items-center">
      <div className="flex flex-col rounded-t p-5 bg-primaryBg mt-1 mx-5 w-9/12 h-fit gap-5">
        <p className="font-bold text-4xl">
          หมายเลขเครื่อง {request.AC.AC_Serial}
        </p>
        <div className="grid grid-cols-2 grid-rows-5 gap-x-40 gap-y-5 w-fit">
          <p className="font-bold">ชื่อ - สกุล</p>
          <p>{request.AC.Customer.U_Name}</p>
          <p className="font-bold">รุ่น</p>
          <p>{request.AC.AC_Model}</p>
          <p className="font-bold">ที่อยู่</p>
          <p>{request.AC.AC_Address}</p>
          <p className="font-bold">ประกัน</p>
          <p
            className={
              "font-bold " + (insurance ? "text-emerald-600" : "text-rose-700")
            }
          >
            {insurance ? "อยู่ในประกัน" : "ไม่อยู่ในประกัน"}
          </p>
          <p className="font-bold">เบอร์โทร</p>
          <p>{request.AC.Customer.U_Tel}</p>
          <p className="font-bold">รายละเอียด</p>
          <p>{request.RP_Detail}</p>
        </div>
        <p className="font-bold text-2xl">สาเหตุ</p>
        <textarea
          className="w-8/12 h-32 rounded"
          required
          placeholder="กรอกสาเหตุของการพัง"
          value={cause}
          onChange={(e) => setCause(e.target.value)}
        ></textarea>
        <p className="font-bold text-2xl">วิธีการซ่อม</p>
        <textarea
          className="w-8/12 h-32 rounded"
          required
          placeholder="กรอกวิธีการซ่อม"
          value={fixDetail}
          onChange={(e) => setFixDetail(e.target.value)}
        ></textarea>
        <div className="flex gap-10">
          <button
            className="bg-primary font-bold text-lg text-white w-fit p-3 rounded-3xl"
            onClick={finishWork}
          >
            ยืนยันการซ่อม
          </button>
          <button
            className="bg-white font-bold text-lg text-black w-fit p-3 rounded-3xl"
            onClick={extendWork}
          >
            ซ่อมไม่สำเร็จ
          </button>
        </div>
      </div>
    </div>
  );
}
