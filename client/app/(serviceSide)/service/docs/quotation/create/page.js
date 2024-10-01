"use client"

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function CreateQuotation() {
    const searchParams = useSearchParams();
    const RF_Id = searchParams.get("RF_Id");

    useEffect(() => {

    })
}