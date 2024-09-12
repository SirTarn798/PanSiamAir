export default function AddAC() {
    return(
        <div className="flex flex-col w-screen h-screen pl-16 pt-5 pr-3">
            <div className="flex items-center gap-1.5">
                <img src="/right-arrow.png" className="w-8 h-8"/>
                <p>ย้อนกลับ</p>
            </div>
            <div className="flex flex-col bg-primaryBg p-5 gap-2 rounded">
                <p>กรอกใบรับประกันแอร์</p>
                <p>รุ่น (Model)</p>
                <input type="text"/>
                <p>หมายเลขเครื่อง (Serial Number)</p>
                <input type="text"/>
                <p>วัน/เดือน/ปี ที่ติดตั้ง (Installation Date)</p>
                <input type="text"/>
                <p>ชื่อ - นามสกุล ผู้ซื้อ (Customer Name)</p>
                <input type="text"/>
                <p>ที่อยู่ (Address)</p>
                <input type="text"/>
                <p>เบอร์ติดต่อ (Tel/Moblie)</p>
                <input type="text"/>
                <button className="bg-primary w-28 p-2 rounded-3xl self-center">บันทึกข้อมูล</button>
            </div>
        </div>
    )
}