import BackBtn from "@/app/component/backBtn";

export default function AddEmployee() {
  return (
    <div className="flex flex-col w-screen h-screen pl-16 pt-5 pr-3">
      <BackBtn />
      <div className="flex flex-col bg-primaryBg p-5 gap-2 rounded">
        <p>ชื่อ - นามสกุล</p>
        <input type="text" required />
        <p>อีเมลล์</p>
        <input type="text" required />
        <p>เบอร์โทร</p>
        <input type="text" required />
        <p>ตำแหน่ง</p>
        <select required>
          <option value="" disabled selected>
            Select position
          </option>
          <option value="Service">Service</option>
          <option value="Finance">Finance</option>
          <option value="Store">Store</option>
          <option value="Head">Head</option>
        </select>
      </div>
    </div>
  );
}
