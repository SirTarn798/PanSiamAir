"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Receipt, Box, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function ReceiptPage() {
  const [receipts, setReceipts] = useState(null);
  const router = useRouter();
  const userId = useSelector((state) => state.user.id);

  useEffect(() => {
    const getReceipts = async () => {
      try {
        const response = await fetch("/api/getReceipts", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            id: userId,
          }),
        });
        const data = await response.json();
        setReceipts(data.receipts);
      } catch (error) {
        alert("ขออภัย มีข้อผิดพลาดในการแสดงผล");
        router.push("/");
      }
    };
    getReceipts();
  }, []);

  if (!receipts) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  }

  if (receipts.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            ไม่พบประวัติการซ่อมของคุณ
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-2 mb-6">
        <Receipt className="h-6 w-6" />
        <h1 className="text-2xl font-bold">ประวัติการซ่อม</h1>
      </div>

      <ScrollArea className="h-[600px] rounded-md border p-4">
        <div className="space-y-4">
          {receipts.map((receipt, index) => (
            <Card key={receipt.receipt_id} className="shadow-sm">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      ใบเสร็จเลขที่ {receipt.receipt_id}
                    </CardTitle>
                    <CardDescription>
                      วันที่: {new Date(receipt.receipt_date).toLocaleDateString('th-TH')}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ยอดรวม: {receipt.total_amount.toLocaleString()} บาท
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">รายละเอียดเครื่องปรับอากาศ</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p>รุ่น: {receipt.aircondition_model}</p>
                      <p>Serial: {receipt.aircondition_serial}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">รายละเอียดการซ่อม</h3>
                    <div className="space-y-2 text-sm">
                      <p>สาเหตุ: {receipt.repair_cause || "-"}</p>
                      <p>การซ่อม: {receipt.repair_details || "-"}</p>
                      <p>ปัญหาที่พบ: {receipt.problem_detail}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">รายการอะไหล่</h3>
                    <div className="space-y-2 text-sm">
                      <p>{receipt.spare_parts_details}</p>
                      <p className="font-medium">
                        ราคาอะไหล่รวม: {receipt.spare_parts_cost.toLocaleString()} บาท
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p>ราคารวม: {receipt.subtotal.toLocaleString()} บาท</p>
                      <p>ส่วนลด: {receipt.discount.toLocaleString()} บาท</p>
                    </div>
                    <div>
                      <p>VAT: {receipt.vat.toLocaleString()} บาท</p>
                      <p className="font-bold">
                        ยอดสุทธิ: {receipt.total_amount.toLocaleString()} บาท
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}