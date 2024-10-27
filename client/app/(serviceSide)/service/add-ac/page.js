"use client";

import BackBtn from "@/app/component/backBtn";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddAC() {

  const [status, setStatus] = useState(1);
  const router = useRouter();
  const handleAddAC = async (e) => {
    e.preventDefault();
    setStatus(2);
    const formData = new FormData(e.target);
    const ACData = Object.fromEntries(formData);
    try {
      const response = await fetch("/api/addAC", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          ACData,
        }),
      });
      alert("เพิ่มแอร์สำเร็จ")
      router.push("/service")
    } catch (err) {
      alert("มีข้อผิดพลาด ลองใหม่อีกครั้ง")
      console.log(err.message);
    }
  };
  return (
    <div className="flex flex-col w-screen h-screen pl-16 pt-5 pr-3">
      <BackBtn />
      <form
        className="flex flex-col bg-primaryBg p-5 gap-2 rounded"
        onSubmit={handleAddAC}
      >
        <p>กรอกใบรับประกันแอร์</p>
        <p>รุ่น (Model)</p>
        <input type="text" name="model" required />
        <p>หมายเลขเครื่อง (Serial Number)</p>
        <input type="text" name="serial" required />
        <p>วัน/เดือน/ปี ที่ติดตั้ง (Installation Date)</p>
        <input type="date" name="date" required />
        <p>ที่อยู่ (Address)</p>
        <input type="text" name="address" required />
        <p>ร้านค้า</p>
        <input type="text" name="store" required/>
        <button className={`w-28 p-2 rounded-3xl self-center ` + (status === 1 ? "bg-primary" : "bg-primaryBg")} disabled={status === 2}>
          บันทึกข้อมูล
        </button>
      </form>
    </div>
  );
}