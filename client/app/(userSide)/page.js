"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ListAC from "../component/listAC"

export default function Home() {
  const userId = useSelector((state) => state.user.id); // Fetch the user id from Redux store
  const [id, setId] = useState("");
  const [acs, setACs] = useState([]);

  useEffect(() => {
    if (userId) {
      setId(userId);
    }
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/getAC", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            id,
          }),
        });
        const data = await response.json();
        setACs(data.acs);
      } catch (err) {
        console.log(err.message);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <main className="flex flex-col w-screen h-screen p-16">
      <button className="self-end">+ เพิ่มรายการแอร์</button>
      <div className="flex flex-col w-full bg-primaryBg rounded-t">
        <div className="grid grid-cols-6 grid-rows-1 border-solid border-b-2 border-black p-3">
          <p>หมายเลขเครื่อง</p>
          <p>รุ่น</p>
          <p>ที่อยู่</p>
          <p>สถานะประกัน</p>
          <p>สถานะการซ่อม</p>
          <p></p>
        </div>
        {acs.map((ac) => {
          console.log(ac)
          return <ListAC ac={ac}/>
        })}
      </div>
    </main>
  );
}
