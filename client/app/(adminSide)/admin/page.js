"use client";

import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  return (
    <div className="w-screen h-screen flex justify-center">
      <div className="w-9/12 bg-primaryBg m-5 p-3 rounded">
        <button className="p-2 rounded bg-primary font-bold" onClick={() => router.push("/admin/add-employee")}>
          + เพิ่มพนักงาน
        </button>
      </div>
    </div>
  );
}
