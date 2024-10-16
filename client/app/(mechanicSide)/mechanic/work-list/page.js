"use client";

import { useEffect, useState } from "react";
import RequestList from "@/app/component/requestList";
import { useSelector } from "react-redux";

export default function WorkListPage() {
  const [reqState, setReqState] = useState(1);
  const [requests, setRequests] = useState();
  const id = useSelector((state) => state.user.id);

  const getRequests = async (state) => {
    setReqState(state);
    try {
      const response = await fetch("/api/getWorkList", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });
      if (response.status === 201) {
        const data = await response.json();
        setRequests(data.requestProblems);
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getRequests(1);
  }, []);

  return (
    <div className="flex flex-col gap-10 w-screen h-screen p-10">
      <p className="text-4xl font-bold">ใบสำคัญจ่าย</p>
      <div className="flex gap-20 text-lg">
        <p
          className={
            "p-4 hover:bg-primary rounded-full cursor-pointer font-bold " +
            (reqState === 1 ? "bg-primary" : "")
          }
          onClick={() => getRequests(1)}
        >
          งานที่กำลังจะถึง
        </p>
        <p
          className={
            "p-4 hover:bg-primary rounded-full cursor-pointer font-bold " +
            (reqState === 2 ? "bg-primary" : "")
          }
          onClick={() => getRequests(2)}
        >
          เสร็จสิ้น
        </p>
        
      </div>
      <div className="flex flex-col gap-3">
      <div className="grid grid-cols-[2fr_3fr_2fr_2fr_3fr_2fr] grid-rows-1 bg-primaryBg rounded-3xl p-3 font-bold">
          <p>เลขที่ใบขอรับบริการ</p>
          <p>วันที่ออกใบขอรับบริการ</p>
          <p>หมายเลขเครื่อง</p>
          <p>รุ่น</p>
          <p>วันและเวลา</p>
          <p></p>
        </div>
        {requests?.map((request) => {
          return <RequestList request={request} key={request.RP_Id} mech={true}/>;
        })}
      </div>
    </div>
  );
}
