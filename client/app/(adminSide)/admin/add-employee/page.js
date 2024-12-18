"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddEmployee() {
  const [status, setStatus] = useState(true)
  const router = useRouter();
  
  const addEmployee = async (e) => {
    e.preventDefault();
    setStatus(false)
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData);
    try {
      const response = await fetch("/api/registerApi", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email : userData.email,
          password : userData.password,
          role : userData.role,
          tel: userData.tel,
          name: userData.name,
        }),
      });
      if(response.status === 201) {
        alert("เพิ่มพนักงานสำเร็จ")
        router.push("/admin")
      } else if(response.status === 500) {
        throw new Error("อีเมลล์ได้ถูกใช้ไปแล้ว โปรดลองอีเมลล์อื่น");
      }
    } catch (err) {
      alert(err.message)
      setStatus(true)
    }
  }
  return (
    <div className="flex flex-col w-screen h-screen pl-16 pt-5 pr-3">
      <form className="flex flex-col bg-primaryBg p-5 gap-2 rounded" onSubmit={addEmployee}>
        <p>ชื่อ - นามสกุล</p>
        <input type="text" required name="name"/>
        <p>อีเมลล์</p>
        <input type="text" required name="email"/>
        <p>รหัสผ่าน</p>
        <input type="password" required name="password" minLength={8}/>
        <p>เบอร์โทร</p>
        <input type="number" required name="tel" minLength={8}/>
        <p>ตำแหน่ง</p>
        <select required name="role">
          <option value="" disabled selected>
            Select position
          </option>
          <option value="SERVICE">ธุรการ</option>
          <option value="FINANCE">การเงิน</option>
          <option value="STORE">คลัง</option>
          <option value="HEAD">หัวหน้าแผนก</option>
          <option value="MECHANIC">ช่าง</option>
        </select>
        <button className={`w-28 p-2 rounded-3xl self-center1 ${status ? "bg-primary" : "bg-primaryBg cursor-not-allowed"}`}>
          บันทึกข้อมูล
        </button>
      </form>
    </div>
  );
}
