"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import upload from "@/lib/upload";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serial = searchParams.get("serial");
  const [request, setRequest] = useState(null);
  const [quotation, setQuotation] = useState(null);
  const id = useSelector((state) => state.user.id);

  const [receipt, setReceipt] = useState({
    file: null,
    url: "",
  });

  useEffect(() => {
    const getRequest = async () => {
      try {
        const response = await fetch("/api/getRequestFormFromSerial", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            serial,
            id,
          }),
        });
        let data = await response.json();
        if (response.status === 200) {
          setRequest(data.requests);
        } else {
          throw new Error("ขออภัย มีข้อผิดพลาดในการ Fetch request");
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    getRequest();
  }, [serial]);

  useEffect(() => {
    const getQuotation = async () => {
      if (!request) {
        return;
      }
      try {
        const response = await fetch("/api/getQuotationFromRF", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            rf_id: request.RF_Id,
          }),
        });
        const data = await response.json();
        if (response.status === 201) {
          setQuotation(data.quotation);
        } else {
          throw new Error("ขออภัย มีข้อผิดพลาดในการ Fetch quotation");
        }
      } catch (error) {
        console.log(error);
      }
    };
    getQuotation();
  }, [request]);

  const handleImageClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setReceipt({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const receiptData = Object.fromEntries(formData);
    if (!receipt.file) {
      alert("โปรดอัปโหลดหลักฐานด้วย");
      return;
    }
    const receiptPic = await upload(receipt.file, "payment_evidence");
    try {
      const response = await fetch("/api/uploadPaymentRequest", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          pic: receiptPic,
          data: receiptData,
          rf_id: request.RF_Id,
          rp_id: request.RP_Id,
          serial,
        }),
      });
      if(response.status === 200) {
        alert("การอัปโหลดสำเร็จ")
        router.push("/");
      }
    } catch (error) {
      alert("มีข้อผิดพลาด ลองใหม่อีกครั้ง")
      console.log(error)
    }
  };

  return (
    <div className="flex justify-center w-screen h-screen">
      <form
        className="w-9/12 h-fit bg-primaryBg rounded m-10 flex flex-col gap-3 p-5"
        onSubmit={submitRequest}
      >
        <h1 className="font-bold">หมายเลขเครื่อง</h1>
        <input
          className="w-9/12 rounded p-2"
          value={serial}
          readOnly
          name="serial"
        />
        <h1 className="font-bold">ชื่อ - สกุลผู้โอน</h1>
        <input
          className="w-9/12 rounded p-2"
          type="text"
          required
          name="name"
        />
        <h1 className="font-bold">วัน - เวลาที่โอน</h1>
        <input
          className="w-9/12 rounded p-2"
          type="datetime-local"
          required
          name="dateTime"
        />
        <h1 className="font-bold">ธนาคารที่โอน</h1>
        <input
          className="w-9/12 rounded p-2"
          type="text"
          required
          name="bank"
        />
        <h1 className="font-bold">จำนวน</h1>
        <input
          className="w-9/12 rounded p-2"
          value={quotation?.Q_Grand_total}
          readOnly
          name="price"
        />
        <div className="flex gap-10 items-center">
          <h1 className="font-bold">อัปโหลดหลักฐานการชำระเงิน</h1>
          <img
            src="/new-folder.png"
            className="w-8 h-8"
            onClick={handleImageClick}
          />
        </div>
        <img src={receipt.url} className="w-4/12 h-auto" />
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <button className="bg-primary w-28 p-2 rounded-3xl font-bold">
          บันทึกข้อมูล
        </button>
      </form>
    </div>
  );
}
