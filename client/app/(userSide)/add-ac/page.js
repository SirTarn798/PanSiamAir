"use client";

import BackBtn from "@/app/component/backBtn";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function AddAC() {
  const id = useSelector((state) => state.user.id);
  const [wc, setWC] = useState({
    file: null,
    url: "",
  });

  const handleAddAC = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const ACData = Object.fromEntries(formData);
    ACData.C_ID = id;
    try {
      console.log("ddx");
      // const reponse = await fetch("/api/addWC", {
      //   method: "POST",
      //   headers: {
      //     "content-type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     ACData,
      //   }),
      // });
    } catch (err) {
      console.log(err.message);
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
        <div className="flex gap-10 items-center">
          <p>อัปโหลดรูปใบรับประกัน</p>
          <img
            src="/new-folder.png"
            className="w-8 h-8"
            onClick={handleImageClick}
          />
        </div>
        <img src={wc.url} className="w-4/12 h-auto"/>
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <button className="bg-primary w-28 p-2 rounded-3xl self-center">
          บันทึกข้อมูล
        </button>
      </form>
    </div>
  );
}
