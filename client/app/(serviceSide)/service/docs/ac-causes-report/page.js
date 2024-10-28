import CausesReport from "../../../../component/causesReport";

export default async function ReportCauses() {
  const getReport = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/getAcCauses`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }
  );
  const data = await getReport.json();
  const causes = data.acs;

  return (
    <div className="w-screen h-screen">
      <CausesReport causes={causes} />
    </div>
  );
}
