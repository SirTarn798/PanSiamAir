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
      <div>
        <button
          className="flex items-center p-5 gap-5 w-full hover:bg-neutral-200"
          onClick={toggleDropdown}
        >
          <img src="/papers.png" alt="ac list icon" width={35} height={35} />
          <p className="font-bold">การอนุมัติเอกสาร</p>
          <span className="ml-auto">{isDropdownOpen ? "▲" : "▼"}</span>
        </button>
        <div
          className={`overflow-y-auto transition-[max-height] duration-500 ease-in-out ${
            isDropdownOpen ? "max-h-40" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-2 pl-16">
            <button className="text-left p-3 hover:bg-neutral-200"
              onClick={() => router.push("/store/docs/distribute-voucher")}
            >
              ใบสำคัญจ่าย
            </button>
            <button className="text-left p-3 hover:bg-neutral-200" onClick={() => router.push("/store/docs/receive-voucher")}>
              ใบสำคัญรับ
            </button>
          </div>
        </div>
      </div>
      <button className="flex items-center p-5 gap-5 hover:bg-neutral-200" onClick={() => router.push("/store/add-spare")}>
        <img src="/ac-ventilation.png" alt="ac list icon" width={35} height={35} />
        <p className="font-bold">เพิ่มอะไหล่เข้าสู่ระบบ</p>
      </button>
    </div>
  );
}

export default StoreNavBar;
