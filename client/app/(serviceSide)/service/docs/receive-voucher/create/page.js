"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function CreateReceiveVoucher() {
  const [status, setStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [items, setItems] = useState([]);
  const [rf_id, setRF_Id] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [submitStatus, setSubmitStatus] = useState(1);

  const router = useRouter();

  // Reference for the modal AC
  const modalRef = useRef(null);

  useEffect(() => {

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
          setStatus(true)
        } else {
          throw new Error("ขออภัย ขณะนี้เซิร์ฟเวอร์มีปัญหา กรุณาลองอีกครั้ง");
        }
      } catch (error) {
        alert(error.message);
      }
    };
    getSpares();
  }, []);

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

  const handleAddItemClick = () => {
    setShowModal(!showModal); // Toggle modal visibility
  };

  const handleSelectItem = (item) => {
    // Check if the item is already selected
    const itemExists = selectedItems.some(
      (selectedItem) => selectedItem.S_Id === item.S_Id
    );
    if (!itemExists) {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]); // Initialize quantity to 1
      setShowModal(false); // Close modal after item is selected
    }
  };

  const handleRemoveItem = (itemId) => {
    // Remove item from selected items
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

  const handleMakeReceiveVoucher = async () => {
    setSubmitStatus(2);
    try {
      const response = await fetch("/api/createReceiveVoucher", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          selectedItems,
          rf_id,
        }),
      });
      if (response.status === 200) {
        alert("ออกใบสำคัญรับสำเร็จ");
        router.push("/service");
      } else if (response.status === 400) {
        throw new Error("หมายเลขใบขอรับบริการไม่ถูกต้อง");
      } else {
        throw new Error("ขออภัย เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง");
      }
    } catch (error) {
      alert(error.message);
    }
    setSubmitStatus(1);
  };

  // Filter items based on searchQuery
  const filteredItems = items.filter((item) =>
    item.S_Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (status === true) {
    return (
      <div className="flex flex-col w-screen p-16 bg-primaryBg m-10 rounded-3xl gap-10">
        <div className="flex flex-col gap-3 font-bold">
          <p className="text-3xl">ออกใบสำคัญรับ</p>
          <input className="p-3 w-9/12 rounded" placeholder="กรอกหมายเลขใบสำคัญรับ" type="text" value={rf_id} onChange={(e) => setRF_Id(e.target.value)} required/>
        </div>

        <table className="w-full border-collapse rounded-lg overflow-hidden p-5">
          <thead>
            <tr className="font-bold bg-zinc-800 text-white">
              <td className="p-3">สินค้า</td>
              <td className="p-3">จำนวน</td>
              <td className="p-3">ราคาต่อหน่วย</td>
              <td className="p-3">
                <img src="/settings.png" alt="setting" width={20} height={20} />
              </td>
            </tr>
          </thead>
          <tbody>
            {selectedItems.map((item, index) => (
              <tr
                key={index}
                className={`odd:bg-gray-100 even:bg-gray-200`} // Alternating row colors
              >
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
              className="absolute top-full mt-2 left-0 bg-white p-4 rounded shadow-lg w-64 max-h-60 overflow-y-auto" // Added height and scroll
            >
              <p className="font-bold">เลือกสินค้า</p>

              {/* Search bar */}
              <input
                type="text"
                placeholder="ค้นหา..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 mb-2 border border-gray-300 rounded"
              />

              <ul className="mt-2">
                {filteredItems.length > 0 ? (
                  filteredItems
                    .filter(
                      (item) =>
                        !selectedItems.some(
                          (selectedItem) => selectedItem.S_Id === item.S_Id
                        )
                    )
                    .map((item) => (
                      <li
                        key={item.S_Id}
                        onClick={() => handleSelectItem(item)}
                        className="cursor-pointer p-2 hover:bg-gray-200"
                      >
                        <span className="font-bold">
                          {/* Ensure S_Id has 5 digits by padding with zeros */}
                          {String(item.S_Id).padStart(5, "0")}
                        </span>{" "}
                        | {item.S_Name}
                      </li>
                    ))
                ) : (
                  <p className="text-center text-gray-500">ไม่มีอะไหล่</p>
                )}
              </ul>
            </div>
          )}
        </div>
        <div className="flex-grow"></div>

        <button
          className={
            `p-3 rounded-3xl text-white font-bold place-self-start ` +
            (submitStatus === 1 ? "bg-primary" : "bg-primaryBg")
          }
          disabled={submitStatus === 2}
          onClick={handleMakeReceiveVoucher}
        >
          ออกใบสำคัญรับ
        </button>
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
