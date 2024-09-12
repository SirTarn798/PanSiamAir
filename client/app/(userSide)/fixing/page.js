import BackBtn from "../../component/backBtn";
import SubmitBtn from "../../component/submitBtn"

export default function FixRequest() {
  return (
    <div className="flex flex-col w-screen h-screen pl-16 pt-5 pr-3">
      <h1>แจ้งซ่อม</h1>
      <BackBtn />
      <div className="flex flex-col bg-primaryBg p-5 rounded gap-5">
        <div className="flex gap-40 justify-center">
          <div className="flex flex-col gap-5">
            <p>หมายเลขเครื่อง 1111</p>
            <p>รุ่น 1111</p>
            <p>สถานะรับประกัน อยู่ในประกัน</p>
          </div>
          <div className="flex flex-col gap-5">
            <p>ชื่อ-นามสกุล ปีปี้ โปโป้</p>
            <p>ที่อยู่ 14/28 Fish Market, Novigrad</p>
            <p>เบอร์โทร 19195195194</p>
          </div>
        </div>
        <h1>รายละเอียดปัญหา</h1>
        <textarea type="text" className="h-20"/>
        <SubmitBtn/>
      </div>
    </div>
  );
}
