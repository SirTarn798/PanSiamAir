"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import checkInsurance from "@/lib/checkInsurance";

export default function RequestPage() {
  const searchParams = useSearchParams();
  const [request, setRequest] = useState();
  const [error, setError] = useState(null);
  const [estimatedMinutes, setEstimatedMinutes] = useState(null);
  const id = searchParams.get("id") || "";
  const router = useRouter();

  let insurance = checkInsurance(request?.AC.AC_Installation_date);

  useEffect(() => {
    const getRequest = async () => {
      try {
        const response = await fetch("/api/getRequestById", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            id,
          }),
        });
        if (response.status === 200) {
          const data = await response.json();
          setRequest(data.requests);
        } else if (response.status === 400) {
          throw new Error("ไม่สามารถเข้าถึงได้เนื่องจากรหัสคำขอซ่อมไม่ถูกต้อง");
        } else if (response.status === 500) {
          throw new Error("โปรดลองอีกครั้งเนื่องจากเซิฟเวอร์มีปัญหา");
        }
      } catch (error) {
        setError(error.message);
      }
    };
    getRequest();
  }, [id]);

  const handleAcceptRequest = async (e) => {
    e.preventDefault();
    await updateRequest("รอทางบริษัทเสนอราคา", "accepted_wait_write_quotation");
    await createRequestForm();
  };

  const handleRejectRequest = async (e) => {
    e.preventDefault();
    await updateRequest("สถานะปกติ", "rejected");
  };

  const updateRequest = async (statusAc, statusRp) => {
    try {
      const response = await fetch("/api/updateRequest", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          serial: request.AC.AC_Serial,
          id,
          statusAc,
          statusRp,
        }),
      });
      if (response.status === 200) {
        router.push("/");
      } else {
        throw new Error("ระบบมีปัญหา กรุณาลองใหม่อีกครั้ง");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const createRequestForm = async () => {
    if (estimatedMinutes === 0) {
      alert("โปรดประมาณเวลาในการซ่อม");
      return;
    }
    try {
      const totalMinutes = parseInt(estimatedMinutes);
      const response = await fetch("/api/createRequestForm", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          id,
          estimatedFixTimeMinutes: totalMinutes,
        }),
      });
      if (response.status != 200) {
        throw new Error("ระบบมีปัญหา กรุณาลองใหม่อีกครั้ง");
      }
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
  if (request)
    return (
      <div className="w-screen flex flex-col items-center">
        {request.RP_Status === "waiting" ? (
          <div className="flex gap-5 w-9/12 my-2 bg-primaryBg h-fit p-2 rounded-full">
            <button
              className="bg-primary font-bold text-white rounded-full p-3 px-5"
              onClick={handleAcceptRequest}
            >
              ยืนยัน
            </button>
            <button
              className="bg-gray-400 font-bold text-white rounded-full p-3 px-5"
              onClick={handleRejectRequest}
            >
              ยกเลิก
            </button>
          </div>
        ) : null}
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
                "font-bold " +
                (insurance ? "text-emerald-600" : "text-rose-700")
              }
            >
              {insurance ? "อยู่ในประกัน" : "ไม่อยู่ในประกัน"}
            </p>
            <p className="font-bold">เบอร์โทร</p>
            <p>{request.AC.Customer.U_Tel}</p>
            <p className="font-bold">รายละเอียด</p>
            <p>{request.RP_Detail}</p>
          </div>
          {/* Input estimate fix time */}
          <div className="flex flex-col gap-2">
            <p className="font-bold">ประมาณเวลาซ่อม</p>
            <div className="flex gap-4">
              <input
                type="number"
                min="0"
                max="59"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(e.target.value)}
                className="w-20 p-2 border rounded"
                placeholder="นาที"
                required
              />
            </div>
          </div>
        </div>
        <div
          className="flex items-center justify-center bg-primary mx-5 rounded-b w-9/12 text-white font-bold h-14 text-2xl cursor-pointer"
          onClick={() =>
            router.push(`/service/chat?chatId=${request.AC.Customer.U_Id}`)
          }
        >
          <p>ไปที่แชท</p>
        </div>
      </div>
    );
}
