"use client";

import { useRouter, useSearchParams } from "next/navigation";
import SubmitBtn from "../../component/submitBtn";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import checkInsurance from "@/lib/checkInsurance";

export default function FixRequest() {
  const searchParams = useSearchParams();
  const serial = searchParams.get("serial") || ""; // Ensure serial is a string
  const id = useSelector((state) => state.user.id);
  const [status, setStatus] = useState(true);
  const [ac, setAC] = useState(null);
  const [detail, setDetail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  let insurance = checkInsurance(ac?.AC_Installation_date);

  useEffect(() => {
    if (!serial) {
      setStatus(false);
    }
  }, [serial]);

  useEffect(() => {
    const getACInfo = async () => {
      try {
        const response = await fetch("/api/accessFixingAC", {
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
          const data = await response.json();
          setAC(data.ac);
        } else {
          throw new Error("AC not found");
        }
      } catch (err) {
        setStatus(false);
      }
    };

    if (serial && id) {
      getACInfo();
    }
  }, [serial, id]);

  if (!status) {
    return (
      <div className="flex flex-col w-screen h-screen pl-16 pt-5 pr-3 items-center justify-center">
        <p className="text-white bg-primary p-4">
          !! ข้อมูลที่กรอกไม่ถูกต้อง คุณไม่มีสิทธิ์จัดการแอร์ตัวนี้
          ระบบอาจมีปัญหา หรือแอร์กำลังอยู่ในกระบวนการซ่อม กรุณาลองอีกครั้ง !!
        </p>
      </div>
    );
  }

  const submit = async () => {
    try {
      const response = await fetch("/api/sendFixRequest", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          serial,
          detail,
          id,
        }),
      });
      if (response.status === 201) {
        alert("ท่านได้ส่งเรื่องซ่อมแล้ว");
        router.push("/");
      } else {
        throw new Error("ระบบมีปัญหา กรุณาลองใหม่อีกครั้ง");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen pl-16 pt-5 pr-3">
      <h1>แจ้งซ่อม</h1>
      <div className="flex flex-col bg-primaryBg p-5 rounded gap-5">
        <div className="flex gap-40 justify-center">
          <div className="flex flex-col gap-5">
            <p>หมายเลขเครื่อง {ac?.AC_Serial}</p>
            <p>รุ่น {ac?.AC_Model}</p>
          </div>
          <div className="flex flex-col gap-5">
            <p>ที่อยู่ {ac?.AC_Address}</p>
            <div className="flex gap-3">
              <p>สถานะรับประกัน {ac?.AC_WarrantyStatus}</p>
              <p
                className={
                  "font-bold " +
                  (insurance ? "text-emerald-600	" : "text-rose-700")
                }
              >
                {insurance ? "อยู่ในประกัน" : "ไม่อยู่ในประกัน"}
              </p>
            </div>
          </div>
        </div>
        <h1>รายละเอียดปัญหา</h1>
        <textarea
          type="text"
          className="h-20"
          value={detail}
          onChange={(e) => {
            setDetail(e.target.value);
          }}
          placeholder="กรอกรายละเอียดปัญหา"
          required
        />
        <p className="text-rose-500">{error}</p>
        <SubmitBtn submit={submit} />
      </div>
    </div>
  );
}
