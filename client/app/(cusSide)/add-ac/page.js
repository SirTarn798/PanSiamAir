"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import upload from "@/lib/upload";
import { useRouter } from "next/navigation";

export default function AddAC() {
  const id = useSelector((state) => state.user.id);
  const [wc, setWC] = useState({
    file: null,
    url: "",
  });
  const [status, setStatus] = useState(0);
  const statusList = [
    "",
    "ทำการเพิ่มแอร์สำเร็จแล้ว",
    "ข้อมูลไม่ถูกต้อง",
    "โปรดอัปโหลดรูปใบรับประกันด้วย",
    "มีข้อผิดพลาดกับเซิร์ฟเวอร์ ลองใหม่อีกครั้ง",
  ];
  const router = useRouter();

  const handleAddAC = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const WCData = Object.fromEntries(formData);
    if (!wc.file) {
      alert("โปรดอัปโหลดรูปใบรับประกันด้วย");
      return;
    }
    const wcPicLink = await upload(wc.file, "wcs");
    WCData.C_ID = id;
    WCData.wcPicLink = wcPicLink;
    try {
      const response = await fetch("/api/assignACtoCustomer", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          WCData,
        }),
      });
      if (response.status === 201) {
        alert("ทำการเพิ่มแอร์สำเร็จแล้ว");
        router.push("/");
      } else if (response.status === 400) {
        alert("ข้อมูลไม่ถูกต้อง");
      } else if (response.status === 500) {
        alert("มีข้อผิดพลาดกับเซิร์ฟเวอร์ ลองใหม่อีกครั้ง");
      }
    } catch (err) {
      alert("มีข้อผิดพลาดกับเซิร์ฟเวอร์ ลองใหม่อีกครั้ง");
    }
  };

  const handleImageClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setWC({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen pl-16 pt-5 pr-3">
      <form
        className="flex flex-col bg-primaryBg p-5 gap-2 rounded"
        onSubmit={handleAddAC}
      >
        <p>กรอกใบรับประกันแอร์</p>
        <p>รุ่น (Model)</p>
        <input type="text" name="model" required />
        <p>หมายเลขเครื่อง (Serial Number)</p>
        <input type="text" name="serial" required />
        <div className="flex gap-10 items-center">
          <p>อัปโหลดรูปใบรับประกัน</p>
          <img
            src="/new-folder.png"
            className="w-8 h-8"
            onClick={handleImageClick}
          />
        </div>
        <img src={wc.url} className="w-4/12 h-auto" />
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <p
          className={
            `bg-zinc-800 font-bold p-2 rounded w-fit ` +
            (status === 1 ? "text-lime-500" : "text-rose-500")
          }
        >
          {statusList[status]}
        </p>
        <button className="bg-primary w-28 p-2 rounded-3xl self-center">
          บันทึกข้อมูล
        </button>
      </form>
    </div>
  );
}
