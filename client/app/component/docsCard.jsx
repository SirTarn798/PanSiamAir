import { useRouter } from "next/navigation";

export default function DocsCard(props) {
  const quotation = props.quotation;
  const router = useRouter();
  return (
    <div className="flex flex-col gap-1 bg-primary text-black p-5 font-bold rounded-3xl bg-opacity-30">
      <h3>หมายเลขใบเสนอราคา : {quotation.Request_form?.QUOTATION?.Q_Id}</h3>
      <p>วันที่ออก: {quotation.Request_form?.QUOTATION?.Q_Date}</p>
      <p>ราคารวม: {quotation.Request_form?.QUOTATION?.Q_Total}</p>
      <p>ส่วนลด: {quotation.Request_form?.QUOTATION?.Q_Discount}</p>
      <p>ภาษีมูลค่าเพิ่ม: {quotation.Request_form?.QUOTATION?.Q_Vat}</p>
      <p>ราคาสุทธิ: {quotation.Request_form?.QUOTATION?.Q_Grand_total}</p>
      <button
        className="bg-primary p-3 rounded-3xl mt-3 w-fit"
        onClick={() => router.push(`/head/quotation?rf_id=` + quotation.Request_form?.RF_Id)}
      >
        ดูรายละเอียด
      </button>
    </div>
  );
}
