import AgesReport from "../../../../component/agesReport";

export default async function ReportAges() {
  const getReport = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/getAcAges`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }
  );
  const data = await getReport.json();
  const ages = data.causes;
  return (
    <div className="w-screen h-screen">
      <AgesReport ages={ages} />
    </div>
  );
}
