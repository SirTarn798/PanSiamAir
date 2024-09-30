// Server-side component: no "use client" at the top
import prisma from "@/lib/db";

export default async function QuotationList({ type }) {
  const getQuotations = async () => {
    // Fetch data with Prisma on the server
    const data = await prisma.aIRCONDITION.findMany({});
    return data;
  };

  const quotations = await getQuotations();

  return (
    <div>
      {quotations.map((quotation) => (
        <div key={quotation.id}>
          <p>{quotation.name}</p>
          <p>{quotation.status}</p>
          {/* Render other fields as needed */}
        </div>
      ))}
    </div>
  );
}
