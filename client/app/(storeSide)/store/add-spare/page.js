"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddPartPage() {
  const router = useRouter();
  const [status, setStatus] = useState(1);
  const handleAddSpare = async (e) => {
    e.preventDefault();
    setStatus(2);
    const formData = new FormData(e.target);
    const spareData = Object.fromEntries(formData);
    try {
      const response = await fetch("/api/addSpare", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          spareData,
        }),
      });
      setStatus(1);
      const message = await response.text();
      if (response.status === 201) {
        alert(message);
      } else {
        throw new Error(message);
      }
    } catch (error) {
      alert(error.message);
    }
    location.reload();

  };
  return (
    <div className="flex flex-col w-screen h-screen pl-16 pt-5 pr-3">
      <form
        className="flex flex-col bg-primaryBg p-5 gap-2 rounded"
        onSubmit={handleAddSpare}
      >
        <p className="font-bold text-2xl">เพิ่มอะไหล่</p>
        <p className="font-bold">ชื่อ (Name)</p>
        <input type="text" name="name" required />
        <p className="font-bold">ราคา (Price)</p>
        <input type="number" name="price" required />
        <button
          className={
            `w-28 p-2 rounded-3xl self-center ` +
            (status === 1 ? "bg-primary" : "bg-primaryBg")
          }
          disabled={status === 2}
        >
          บันทึกข้อมูล
        </button>
      </form>
    </div>
  );
}
