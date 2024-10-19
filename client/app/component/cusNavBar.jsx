"use client";

import { useRouter } from "next/navigation";

function CusNavBar() {
  const router = useRouter();

  return (
    <div className={`flex flex-col gap-10 bg-primaryBg w-3/12 h-screen`}>
      <button
        className="flex items-center p-5 gap-5 hover:bg-neutral-200"
        onClick={() => router.push("/")}
      >
        <img src="/ac-ventilation.png" alt="ac list icon" width={35} height={35} />
        <p className="font-bold">การจัดการแอร์</p>
      </button>
    </div>
  );
}

export default CusNavBar;
