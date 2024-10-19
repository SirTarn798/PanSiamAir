"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AppointmentCalendar from "@/app/component/appointmentCalendar";

export default function PickCalendarPage() {
  const searchParams = useSearchParams();
  const serial = searchParams.get("serial");
  const reschedule = searchParams.get("reschedule");
  const id = useSelector((state) => state.user.id);
  const [status, setStatus] = useState(null);
  const [duration, setDuration] = useState(null);

  useEffect(() => {
    const getAccess = async () => {
      try {
        const response = await fetch("/api/accessPickCalendar", {
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
          setDuration(data.ac.RF_EFT);
          setStatus(true);
        } else {
          throw new Error("Access denied");
        }
      } catch (error) {
        setStatus(false);
      }
    };
    getAccess();
  }, [id, serial]);

  if (status) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <AppointmentCalendar initialDuration={duration} reschedule={reschedule}/>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col w-screen h-screen pl-16 pt-5 pr-3 items-center justify-center cursor-not-allowed">
        <p className="text-white bg-primary p-4">
          !! ข้อมูลที่กรอกไม่ถูกต้อง คุณไม่มีสิทธิ์จัดการแอร์ตัวนี้
          ระบบอาจมีปัญหา หรือแอร์กำลังอยู่ในกระบวนการซ่อม กรุณาลองอีกครั้ง !!
        </p>
      </div>
    );
  }
}
