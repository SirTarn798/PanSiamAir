"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function FinanceNavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className={`flex flex-col gap-10 bg-primaryBg w-3/12 h-screen`}>
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
              onClick={() => router.push("/finance/docs/receipt")}
            >
              ใบเสร็จรับเงิน
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinanceNavBar;
