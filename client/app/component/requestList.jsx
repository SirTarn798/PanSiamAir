import { useRouter } from "next/navigation";

export default function RequestList(props) {
  const router = useRouter();
  const status = {
    accepted_wait_write_quotation: "ออกใบเสนอราคา",
    accepted_wait_write_requisition: "ออกรายการเบิกอะไหล่",
    accepted_wait_write_distribute_voucher: "ออกใบสำคัญจ่าย",
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
  }

  return (
    <div className="grid grid-cols-[3fr_3fr_3fr_2fr_1fr_2fr] grid-rows-1 bg-primaryBg rounded-3xl p-3 items-center">
      <p>{props.request.RF_Id}</p>
      <p>{props.request.RF_Date}</p>
      <p>{props.request.AC_Serial}</p>
      <p>{props.request.AC_Model}</p>
      <img src="/pdf-file.png" alt="pdf download" width={30} height={30} />
      <p
        className="bg-primary text-white font-bold w-fit p-2 rounded-3xl cursor-pointer"
        onClick={handleClickButton}
      >
        {status[props.request.RP_Status]}
      </p>
    </div>
  );
}
