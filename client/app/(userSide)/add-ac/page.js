"use client";

import BackBtn from "@/app/component/backBtn";
import { useSelector } from "react-redux";

export default function AddAC() {

  const id = useSelector((state) => state.user.id);

  const handleAddAC = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const ACData = Object.fromEntries(formData);
    ACData.C_ID = id;
    try {
      console.log("ddx");
      const reponse = await fetch("/api/addWC", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          ACData,
        }),
      });
    } catch (err) {
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
        <button className="bg-primary w-28 p-2 rounded-3xl self-center">
          บันทึกข้อมูล
        </button>
      </form>
    </div>
  );
}
