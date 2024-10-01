"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function StoreNavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className={`flex flex-col gap-10 bg-primaryBg w-3/12 h-screen`}>
      <button className="flex items-center p-5 gap-5 hover:bg-neutral-200">
        <img src="/approve.png" alt="ac list icon" width={35} height={35} />
        <p className="font-bold">การอนุมัติเอกสาร</p>
      </button>
      <button className="flex items-center p-5 gap-5 hover:bg-neutral-200">
        <img src="/ac-ventilation.png" alt="ac list icon" width={35} height={35} />
        <p className="font-bold">เพิ่มอะไหล่เข้าสู่ระบบ</p>
      </button>
    </div>
  );
}

export default StoreNavBar;
