"use client"

import { useRouter } from 'next/navigation';
import { useState } from 'react';

function ServiceNavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className={`flex flex-col gap-10 bg-primaryBg w-3/12 ` + (isDropdownOpen ? "h-fit" : "h-screen")}>
      <button className="flex items-center p-5 gap-5 hover:bg-neutral-200">
        <img src="/list-items.png" alt="ac list icon" width={35} height={35} />
        <p className="font-bold">รายการแจ้งซ่อม</p>
      </button>
      <button className="flex items-center p-5 gap-5 hover:bg-neutral-200" onClick={() => router.push("/service/addWC")}>
        <img src="/card.png" alt="ac list icon" width={35} height={35} />
        <p className="font-bold">เพิ่มแอร์เข้าสู่ระบบ</p>
      </button>
      <button className="flex items-center p-5 gap-5 hover:bg-neutral-200" onClick={() => router.push("/service/chat")}>
        <img src="/message.png" alt="ac list icon" width={35} height={35} />
        <p className="font-bold">ข้อความ</p>
      </button>

      {/* Dropdown section */}
      <div>
        <button 
          className="flex items-center p-5 gap-5 w-full hover:bg-neutral-200" 
          onClick={toggleDropdown}
        >
          <img src="/papers.png" alt="ac list icon" width={35} height={35} />
          <p className="font-bold">ออกเอกสาร</p>
          <span className="ml-auto">{isDropdownOpen ? '▲' : '▼'}</span>
        </button>

        {/* Dropdown menu with smooth transition */}
        <div
          className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
            isDropdownOpen ? 'max-h-40' : 'max-h-0'
          }`}
        >
          <div className="flex flex-col gap-2 pl-16">
            <button className="text-left p-3 hover:bg-neutral-200">ใบขอรับบริการ</button>
            <button className="text-left p-3 hover:bg-neutral-200">ใบเสนอราคา</button>
            <button className="text-left p-3 hover:bg-neutral-200">ใบสำคัญจ่าย</button>
            <button className="text-left p-3 hover:bg-neutral-200">ใบสำคัญรับ</button>
          </div>
        </div>
      </div>

      <button className="flex items-center p-5 gap-5 hover:bg-neutral-200">
        <img src="/approve.png" alt="ac list icon" width={35} height={35} />
        <p className="font-bold">การอนุมัติเอกสาร</p>
      </button>
      <button className="flex items-center p-5 gap-5 hover:bg-neutral-200">
        <img src="/calendar.png" alt="ac list icon" width={35} height={35} />
        <p className="font-bold">ปฏิทินการนัดเวลา</p>
      </button>
    </div>
  );
}

export default ServiceNavBar;
