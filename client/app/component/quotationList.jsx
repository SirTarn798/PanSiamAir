import { useRouter } from "next/navigation";

export default function QuotationList(props) {
    const router = useRouter();
  const status = {
    accepted_wait_write_quotation: "ออกใบเสนอราคา",
  };

  const handleClickButton = () => {
    switch (props.quotation.RP_Status) {
      case "accepted_wait_write_quotation":
        createQuotation();
        break;
    }
  };

  const createQuotation = () => {
    router.push(`/service/docs/quotation/create?RF_Id=${props.quotation.RF_Id}`)
  }
  return (
    <div className="grid grid-cols-[3fr_3fr_3fr_2fr_1fr_2fr] grid-rows-1 bg-primaryBg rounded-3xl p-3 items-center">
      <p>{props.quotation.RF_Id}</p>
      <p>{props.quotation.RF_Date}</p>
      <p>{props.quotation.AC_Serial}</p>
      <p>{props.quotation.AC_Model}</p>
      <img src="/pdf-file.png" alt="pdf download" width={30} height={30} />
      <p className="bg-primary text-white font-bold w-fit p-2 rounded-3xl cursor-pointer" onClick={handleClickButton}>
        {status[props.quotation.RP_Status]}
      </p>
    </div>
  );
}
