"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function ServiceNavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownReportOpen, setIsDropdownReportOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleDropdownReport = () => {
    setIsDropdownReportOpen((prev) => !prev);
  };

  return (
    <div className={`flex flex-col gap-10 bg-primaryBg w-3/12 h-screen`}>
      <button
        className="flex items-center p-5 gap-5 hover:bg-neutral-200"
        onClick={() => router.push("/service")}
      >
        <img src="/list-items.png" alt="ac list icon" width={35} height={35} />
        <p className="font-bold">รายการแจ้งซ่อม</p>
      </button>
      <button
        className="flex items-center p-5 gap-5 hover:bg-neutral-200"
        onClick={() => router.push("/service/add-ac")}
      >
        <img src="/card.png" alt="ac list icon" width={35} height={35} />
        <p className="font-bold">เพิ่มแอร์เข้าสู่ระบบ</p>
      </button>
      <button
        className="flex items-center p-5 gap-5 hover:bg-neutral-200"
        onClick={() => router.push("/service/chat")}
      >
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
          <span className="ml-auto">{isDropdownOpen ? "▲" : "▼"}</span>
        </button>

        {/* Dropdown menu with updated height for smoother transition */}
        <div
          className={`overflow-y-auto transition-[max-height] duration-500 ease-in-out ${
            isDropdownOpen ? "max-h-40" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-2 pl-16">
            <button
              className="text-left p-3 hover:bg-neutral-200"
              onClick={() => router.push("/service/docs/quotation")}
            >
              ใบเสนอราคา
            </button>
            <button
              className="text-left p-3 hover:bg-neutral-200"
              onClick={() => router.push("/service/docs/distribute-voucher")}
            >
              ใบสำคัญจ่าย
            </button>
            <button
              className="text-left p-3 hover:bg-neutral-200"
              onClick={() =>
                router.push("/service/docs/receive-voucher/create")
              }
            >
              ใบสำคัญรับ
            </button>
          </div>
        </div>
      </div>
      {/* Dropdown section */}
      <div>
        <button
          className="flex items-center p-5 gap-5 w-full hover:bg-neutral-200"
          onClick={toggleDropdownReport}
        >
          <img src="/papers.png" alt="ac list icon" width={35} height={35} />
          <p className="font-bold">สร้างรายงาน</p>
          <span className="ml-auto">{isDropdownReportOpen ? "▲" : "▼"}</span>
        </button>

        {/* Dropdown menu with updated height for smoother transition */}
        <div
          className={`overflow-y-auto transition-[max-height] duration-500 ease-in-out ${
            isDropdownReportOpen ? "max-h-40" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-2 pl-16">
            <button
              className="text-left p-3 hover:bg-neutral-200"
              onClick={() => router.push("/service/docs/ac-causes-report")}
            >
              รายงานสาเหตุของแอร์ที่เสีย
            </button>
            <button
              className="text-left p-3 hover:bg-neutral-200"
              onClick={() => router.push("/service/docs/ac-ages-report")}
            >
              รายงานอายุของแอร์ก่อนมีอาการพัง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceNavBar;
