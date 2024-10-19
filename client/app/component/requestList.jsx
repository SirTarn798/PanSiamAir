import { useRouter } from "next/navigation";

export default function RequestList(props) {
  console.log(props.request);
  const router = useRouter();
  const status = {
    accepted_wait_write_quotation: "ออกใบเสนอราคา",
    accepted_wait_write_requisition: "ออกรายการเบิกอะไหล่",
    accepted_wait_write_distribute_voucher: "ออกใบสำคัญจ่าย",
    accepted_wait_approve_distribute_voucher: "ยืนยันใบสำคัญจ่าย",
  };

  const handleClickButton = () => {
    switch (props.request.RP_Status) {
      case "accepted_wait_write_quotation":
        createQuotation();
        break;
      case "accepted_wait_write_requisition":
        createRequisiton();
        break;
      case "accepted_wait_write_distribute_voucher":
        createDistributeVoucher();
        break;
      case "accepted_wait_approve_distribute_voucher":
        approveDistributeVoucher();
        break;
      case "accepted_wait_fixing":
        manageWork();
        break;
    }
  };

  const createQuotation = () => {
    router.push(`/service/docs/quotation/create?RF_Id=${props.request.RF_Id}`);
  };

  const createRequisiton = () => {
    router.push(
      `/mechanic/docs/requisition/create?RF_Id=${props.request.RF_Id}`
    );
  };

  const createDistributeVoucher = () => {
    router.push(
      `/service/docs/distribute-voucher/create?RF_Id=${props.request.RF_Id}`
    );
  };

  const approveDistributeVoucher = () => {
    router.push(
      `/store/docs/distribute-voucher/approve?RF_Id=${props.request.RF_Id}`
    );
  };

  const manageWork = () => {
    router.push(`/mechanic/work?RF_Id=${props.request.RF_Id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("th-TH", {
      timeZone: "Asia/Bangkok",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div
      className={
        `grid grid-rows-1 bg-primaryBg rounded-3xl p-3 items-center grid-cols-` +
        (props.mech ? "[2fr_3fr_2fr_2fr_3fr_2fr]" : "[3fr_3fr_3fr_2fr_1fr_2fr]")
      }
    >
      <p>{props.request.RF_Id}</p>
      <p>{formatDate(props.request.RF_Date)}</p>
      <p>{props.request.AC_Serial}</p>
      <p>{props.request.AC_Model}</p>
      {!props.mech ? (
        <img src="/pdf-file.png" alt="pdf download" width={30} height={30} />
      ) : (
        <p>
          {formatDate(props.request.s_start_time) + " "}
          {formatTime(props.request.s_start_time) +
            " - " +
            formatTime(props.request.s_end_time)}
        </p>
      )}
      <p
        className="bg-primary text-white font-bold w-fit p-2 rounded-3xl cursor-pointer"
        onClick={handleClickButton}
      >
        {!props.mech ? status[props.request.RP_Status] : "ดูรายละเอียด"}
      </p>
    </div>
  );
}
