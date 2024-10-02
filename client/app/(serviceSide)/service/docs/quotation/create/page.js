"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function CreateQuotation() {
  const searchParams = useSearchParams();
  const RF_Id = searchParams.get("RF_Id");
  const [status, setStatus] = useState(null);
  const [rf, setRF] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [items, setItems] = useState([
    // Sample items (example)
    // { S_Id: 1380833, S_Name: "แผงคอนโทรล" },
    // { S_Id: 1380824, S_Name: "พัดลม" },
    // { S_Id: 1380835, S_Name: "ค่าบริการทั่วไป" },
  ]);

  // Reference for the modal
  const modalRef = useRef(null);

  useEffect(() => {
    const checkRequestFormExistence = async () => {
      try {
        const response = await fetch("/api/checkRequestFormExistence", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            RF_Id,
          }),
        });
        if (response.status === 200) {
          const data = await response.json();
          setRF(data.rf);
          setStatus(true);
        } else {
          throw new Error("ขออภัย หมายเลขใบขอรับบริการไม่ถูกต้อง");
        }
      } catch (error) {
        setStatus(false);
      }
    };

    const getSpares = async () => {
      try {
        const response = await fetch("/api/getSpares", {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
        });
        if (response.status === 200) {
          const data = await response.json();
          setItems(data.spares);
        } else {
          throw new Error("ขออภัย ขณะนี้เซิร์ฟเวอร์มีปัญหา กรุณาลองอีกครั้ง");
        }
      } catch (error) {
        alert(error.message);
      }
    };
    checkRequestFormExistence();
    getSpares();
  }, []);

  // Toggle modal visibility
  const handleAddItemClick = () => {
    setShowModal(!showModal);
  };

  // Check if the item is already selected
  const handleSelectItem = (item) => {
    const itemExists = selectedItems.some(
      (selectedItem) => selectedItem.S_Id === item.S_Id
    );
    if (!itemExists) {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]); // Initialize quantity to 1
      setShowModal(false); // Close modal after item is selected
    }
  };

  // Remove item from selected items
  const handleRemoveItem = (itemId) => {
    setSelectedItems(selectedItems.filter((item) => item.S_Id !== itemId));
  };

  const handleIncrement = (itemId) => {
    setSelectedItems(
      selectedItems.map((item) =>
        item.S_Id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrement = (itemId) => {
    setSelectedItems(
      selectedItems.map((item) =>
        item.S_Id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setShowModal(false);
    }
  };

  useEffect(() => {
    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  if (status === true) {
    return (
      <div className="flex flex-col w-screen p-16 bg-primaryBg m-10 rounded-3xl gap-10">
        <div className="flex flex-col gap-3 font-bold">
          <p>ชื่อ - นามสกุล : {rf.Request_problem.AC.Customer.U_Name}</p>
          <p>ที่อยู่ : {rf.Request_problem.AC.AC_Address}</p>
          <p>รหัสใบขอรับบริการ : {rf.RF_Id}</p>
          <p>หมายเลขเครื่อง : {rf.Request_problem.AC.AC_Serial}</p>
          <p>รุ่น : {rf.Request_problem.AC.AC_Model}</p>
        </div>

        <table className="w-full border-collapse rounded-lg overflow-hidden p-5">
          <thead>
            <tr className="font-bold bg-zinc-800 text-white">
              <td className="p-3">สินค้า</td>
              <td className="p-3">จำนวน</td>
              <td className="p-3">ราคาต่อหน่วย</td>
              <td className="p-3">ส่วนลด</td>
              <td className="p-3">มูลค่า</td>
              <td className="p-3">
                <img src="/settings.png" alt="setting" width={20} height={20} />
              </td>
            </tr>
          </thead>
          <tbody>
            {selectedItems.map((item, index) => (
              <tr key={index} className={`odd:bg-gray-100 even:bg-gray-200`}>
                <td className="p-3">{item.S_Name}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleDecrement(item.S_Id)}
                    className="p-1 bg-gray-300 rounded-l-md font-bold"
                  >
                    -
                  </button>
                  <span className="px-2">{item.quantity}</span>
                  <button
                    onClick={() => handleIncrement(item.S_Id)}
                    className="p-1 bg-gray-300 rounded-r-md font-bold"
                  >
                    +
                  </button>
                </td>
                <td className="p-3">{item.S_Price}</td>
                <td className="p-3">0.00</td>
                <td className="p-3">
                  {(item.S_Price * item.quantity).toFixed(2)}{" "}
                </td>
                <td className="p-3">
                  <img
                    src="/trash-bin.png"
                    alt="delete"
                    width={20}
                    height={20}
                    onClick={() => handleRemoveItem(item.S_Id)} // Remove item on click
                    className="cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="relative">
          <button
            onClick={handleAddItemClick}
            className="bg-primary p-3 rounded-3xl text-white font-bold"
          >
            เพิ่มรายการ
          </button>

          {/* Dropdown Modal */}
          {showModal && (
            <div
              ref={modalRef}
              className="absolute top-full mt-2 left-0 bg-white p-4 rounded shadow-lg w-64 max-h-60 overflow-y-auto"
            >
              <p className="font-bold">เลือกสินค้า</p>
              <ul className="mt-2">
                {items
                  .filter(
                    (item) =>
                      !selectedItems.some(
                        (selectedItem) => selectedItem.S_Id === item.S_Id
                      )
                  ) // Filter out selected items
                  .map((item) => (
                    <li
                      key={item.S_Id}
                      onClick={() => handleSelectItem(item)}
                      className="cursor-pointer p-2 hover:bg-gray-200"
                    >
                      {item.S_Name}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex h-screen w-screen justify-center items-center cursor-not-allowed">
        <p className="text-white bg-primary p-4 font-bold">
          ข้อมูล ID ใน URL ไม่ถูกต้อง
        </p>
      </div>
    );
  }
}
