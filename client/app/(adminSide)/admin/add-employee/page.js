"use client"

import BackBtn from "@/app/component/backBtn";

export default function AddEmployee() {

  const addEmployee = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData);
    try {
      const reponse = await fetch("/api/registerApi", {
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
    } catch (err) {
      console.log(err.message);
    }
  }
  return (
    <div className="flex flex-col w-screen h-screen pl-16 pt-5 pr-3">
      <BackBtn />
      <form className="flex flex-col bg-primaryBg p-5 gap-2 rounded" onSubmit={addEmployee}>
        <p>ชื่อ - นามสกุล</p>
        <input type="text" required name="name"/>
        <p>อีเมลล์</p>
        <input type="text" required name="email"/>
        <p>รหัสผ่าน</p>
        <input type="password" required name="password" minLength={8}/>
        <p>เบอร์โทร</p>
        <input type="text" required name="tel" minLength={8}/>
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
        <button className="bg-primary w-28 p-2 rounded-3xl self-center">
          บันทึกข้อมูล
        </button>
      </form>
    </div>
  );
}
