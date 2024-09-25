"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RequestPage() {
  const searchParams = useSearchParams();
  const [request, setRequest] = useState();
  const [error, setError] = useState(null);
  const id = searchParams.get("id") || "";

  let insurance;
  const installationDate = new Date(request?.WC.WC_Installation_date);
  const currentDate = new Date();
  const fourYearsLater = new Date(
    installationDate.setFullYear(installationDate.getFullYear() + 4)
  );

  if (currentDate < fourYearsLater) {
    insurance = true;
  } else {
    insurance = false;
  }

  useEffect(() => {
    const getRequest = async () => {
      try {
        const response = await fetch("api/getRequestById", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            id,
          }),
        });
        if (response.status === 200) {
          const data = await response.json();
          console.log(data.requests);
          setRequest(data.requests);
        } else if (response.status === 400) {
          throw new Error("ไม่สามารถเข้าถึงได้เนื่องจากรหัสคำขอซ่อมไม่ถูกต้อง");
        } else if (response.status === 500) {
          throw new Error("โปรดลองอีกครั้งเนื่องจากเซิฟเวอร์มีปัญหา");
        }
      } catch (error) {
        setError(error.message);
      }
    };
    getRequest();
  }, [id]);

  if (error) {
    return (
      <div className="flex flex-col w-screen h-screen pl-16 pt-5 pr-3 items-center justify-center">
        <p className="text-white bg-primary p-4">{"!! " + error + " !!"}</p>
      </div>
    );
  }
  if (request)
    return (
      <div className="w-screen flex justify-center">
        <div className="flex flex-col rounded p-5 bg-primaryBg m-5 w-full h-fit gap-5">
        <p className="font-bold text-4xl">หมายเลขเครื่อง {request.WC.WC_Serial}</p>
          <div className="grid grid-cols-2 grid-rows-5 gap-x-40 gap-y-5 w-fit">
            <p className="font-bold">ชื่อ - สกุล</p>
            <p>{request.WC.Customer.name}</p>
            <p className="font-bold">รุ่น</p>
            <p>{request.WC.WC_Model}</p>
            <p className="font-bold">ที่อยู่</p>
            <p>{request.WC.WC_Address}</p>
            <p className="font-bold">ประกัน</p>
            <p
              className={
                "font-bold " +
                (insurance ? "text-emerald-600" : "text-rose-700")
              }
            >
              {insurance ? "อยู่ในประกัน" : "ไม่อยู่ในประกัน"}
            </p>
            <p className="font-bold">เบอร์โทร</p>
            <p>{request.WC.Customer.tel}</p>
          </div>
        </div>
      </div>
    );
}
