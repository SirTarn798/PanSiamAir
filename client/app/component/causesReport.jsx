import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const CausesReport = ({ causes }) => {
  // Early return for loading state
  if (!causes) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <Card>
          <CardContent className="flex items-center justify-center min-h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Return early if causes is empty
  if (causes.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <Card>
          <CardContent className="flex items-center justify-center min-h-[200px]">
            <p className="text-muted-foreground">ไม่พบข้อมูลสาเหตุของแอร์ที่เสีย</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const groupedCauses = causes.reduce((acc, cause) => {
    if (!acc[cause.AC_Model]) {
      acc[cause.AC_Model] = [];
    }
    acc[cause.AC_Model].push(cause);
    return acc;
  }, {});

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            รายงานสาเหตุของแอร์ที่เสีย
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Object.entries(groupedCauses).map(([model, modelCauses]) => (
            <div key={model} className="mb-8">
              <h3 className="text-lg font-semibold mb-2 text-primary">
                Model: {model} (จำนวนครั้งในการซ่อม: {modelCauses[0]?.['Total Repairs'] || 0})
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">อันดับ</TableHead>
                      <TableHead>สาเหตุ</TableHead>
                      <TableHead className="text-right">จำนวนครั้ง</TableHead>
                      <TableHead className="text-right">อันตราส่วน</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modelCauses.map((cause, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {cause.Rank}
                        </TableCell>
                        <TableCell>{cause.Cause}</TableCell>
                        <TableCell className="text-right">{cause['Cause Count']}</TableCell>
                        <TableCell className="text-right">
                          {cause['Cause Percentage']}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default CausesReport;