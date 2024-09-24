"use client";

import { useSearchParams } from "next/navigation";
import BackBtn from "../../component/backBtn";
import SubmitBtn from "../../component/submitBtn";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function FixRequest() {
  const searchParams = useSearchParams();
  const serial = searchParams.get("serial") || ""; // Ensure serial is a string
  const id = useSelector((state) => state.user.id);
  const [status, setStatus] = useState(true);
  const [ac, setAC] = useState(null);
  const [detail, setDetail] = useState("");
  const [error, setError] = useState("");

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
      <BackBtn />
      <div className="flex flex-col bg-primaryBg p-5 rounded gap-5">
        <div className="flex gap-40 justify-center">
          <div className="flex flex-col gap-5">
            <p>หมายเลขเครื่อง {ac?.WC_Serial}</p>
            <p>รุ่น {ac?.WC_Model}</p>
            <p>สถานะรับประกัน {ac?.WC_WarrantyStatus}</p>
          </div>
          <div className="flex flex-col gap-5">
            <p>ชื่อ-นามสกุล ปีปี้ โปโป้</p>
            <p>ที่อยู่ {ac?.WC_Address}</p>
            <p>เบอร์โทร 19195195194</p>
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
          placeholder="Provide additional details about the issue"
          required
        />
        <p className="text-rose-500">{error}</p>
        <SubmitBtn submit={submit} />
      </div>
    </div>
  );
}
