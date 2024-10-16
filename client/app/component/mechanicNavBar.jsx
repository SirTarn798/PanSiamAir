"use client";

import { useRouter } from "next/navigation";

function MechanicNavBar() {
  const router = useRouter();

  return (
    <div className={`flex flex-col gap-10 bg-primaryBg w-3/12 h-screen`}>
      <button
        className="flex items-center p-5 gap-5 hover:bg-neutral-200"
        onClick={() => router.push("/mechanic/docs/requisition")}
      >
        <img src="/list-items.png" alt="ac list icon" width={35} height={35} />
        <p className="font-bold">ออกใบขอเบิกอุปกรณ์</p>
      </button>
      <button
        className="flex items-center p-5 gap-5 hover:bg-neutral-200"
        onClick={() => router.push("/mechanic/work-list")}
      >
        <img src="/calendar.png" alt="ac list icon" width={35} height={35} />
        <p className="font-bold">ตารางงาน</p>
      </button>
    </div>
  );
}

export default MechanicNavBar;
