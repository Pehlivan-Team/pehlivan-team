"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, User, Briefcase } from "lucide-react";

// Veri yapısını tanımlıyoruz
export interface StatItem {
  name: string;
  count: number;
}

export interface Stats {
  totalParticipants: number;
  byTeam: StatItem[];
  byDepartment: StatItem[];
}

export function DashboardClientPage({ initialStats }: { initialStats: Stats }) {
  return (
    <div className="space-y-8">
      {/* Üst Kısım: Ana İstatistik Kartları */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Katılımcı</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{initialStats.totalParticipants}</div>
            <p className="text-xs text-muted-foreground">toplam kayıtlı üye</p>
          </CardContent>
        </Card>
      </div>

      {/* Alt Kısım: Detay Tabloları */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Takımlara Göre Dağılım */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><User className="h-5 w-5"/> Takımlara Göre Dağılım</h2>
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Takım Adı</TableHead>
                  <TableHead className="text-right">Kişi Sayısı</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialStats.byTeam.map((item) => (
                  <TableRow key={item.name}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-right font-bold">{item.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Bölümlere Göre Dağılım */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Briefcase className="h-5 w-5"/> Bölümlere Göre Dağılım</h2>
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bölüm Adı</TableHead>
                  <TableHead className="text-right">Kişi Sayısı</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialStats.byDepartment.map((item) => (
                  <TableRow key={item.name}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-right font-bold">{item.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}