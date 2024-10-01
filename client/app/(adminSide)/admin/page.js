"use client"

import { useRouter } from "next/navigation"

export default function AdminPage() {
    const router = useRouter();
    return(
        <div>
            <button onClick={() => router.push("/admin/add-employee")}>+ เพิ่มพนักงาน</button>
        </div>
    )
}