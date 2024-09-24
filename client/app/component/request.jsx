export default function Request(props) {
  let insurance;
  const installationDate = new Date(props.request.WC.WC_Installation_date);
  const currentDate = new Date();
  const fourYearsLater = new Date(
    installationDate.setFullYear(installationDate.getFullYear() + 4)
  );
  if (currentDate < fourYearsLater) {
    insurance = true;
  } else {
    insurance = false;
  }
  return (
    <div className="flex flex-col bg-primaryBg rounded p-5 w-8/12">
      <div className="grid grid-cols-4 grid-rows-3 gap-3">
        <p className="font-bold">หมายเลขเครื่อง</p>
        <p>{props.request.WC_Serial}</p>
        <p className="font-bold">ชื่อ - สกุล</p>
        <p>{props.request.WC.Customer.name}</p>
        <p className="font-bold">รุ่น</p>
        <p>{props.request.WC.WC_Model}</p>
        <p className="font-bold">ที่อยู่</p>
        <p>{props.request.WC.WC_Address}</p>
        <p className="font-bold">ประกัน</p>
        <p
          className={
            "font-bold " + (insurance ? "text-emerald-600" : "text-rose-700")
          }
        >
          {insurance ? "อยู่ในประกัน" : "ไม่อยู่ในประกัน"}
        </p>
        <p className="font-bold">เบอร์โทร</p>
        <p>{props.request.WC.Customer.tel}</p>
      </div>
      <p className="mt-10 p-3 bg-primary rounded-full w-fit justify-end self-end font-bold cursor-pointer">ดูรายละเอียด</p>
    </div>
  );
}
