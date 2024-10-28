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

const AgesReport = ({ ages }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            รายงานอายุการใช้งานของแอร์
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>รุ่น</TableHead>
                  <TableHead className="text-right">จำนวนการซ่อม</TableHead>
                  <TableHead className="text-right">ระยะเวลาเฉลี่ย (วัน)</TableHead>
                  <TableHead className="text-right">ระยะเวลาต่ำสุด (วัน)</TableHead>
                  <TableHead className="text-right">ระยะเวลาสูงสุด (วัน)</TableHead>
                  <TableHead className="text-right">อายุเฉลี่ย (ปี)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ages.map((age, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{age.AC_Model}</TableCell>
                    <TableCell className="text-right">{age['Number of Repairs']}</TableCell>
                    <TableCell className="text-right">
                      {Number(age['Average Days Until Repair']).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {Number(age['Minimum Days Until Repair']).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {Number(age['Maximum Days Until Repair']).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {Number(age['Average Years Until Repair']).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgesReport;