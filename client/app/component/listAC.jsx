import { useRouter } from "next/navigation";

export default function ListAC(props) {
  let ac = props.ac;
  let insurance;
  const router = useRouter();

  const handleFixRequest = () => {
    if (ac.WC_Status != "สถานะปกติ") {
      return;
    }
    router.push(`/fixing?serial=${ac.WC_Serial}`);
  };

  const status = {
    สถานะปกติ: "bg-primary cursor-pointer",
    รอพิจารณาซ่อม: "bg-black text-white cursor-not-allowed",
    รอยืนยันราคา: "bg-black text-white curor-pointer",
    รอเลือกวันซ่อม: "bg-black text-white cursor-pointer",
    อยู่ในขั้นตอนการซ่อม: "bg-black text-white cursor-not-allowed",
  };

  const installationDate = new Date(ac.WC_Installation_date);
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
    <div className="grid grid-cols-5 grid-rows-1 p-3 items-center">
      <p>{ac.WC_Serial}</p>
      <p>{ac.WC_Model}</p>
      <p>{ac.WC_Address}</p>
      <p className={"font-bold " + (insurance ? "text-emerald-600	" : "text-rose-700")}>{insurance ? "อยู่ในประกัน" : "ไม่อยู่ในประกัน"}</p>
      <p
        className={"rounded-lg w-fit p-2 " + status[ac.WC_Status]}
        onClick={handleFixRequest}
      >
        {ac.WC_Status}
      </p>
    </div>
  );
}
