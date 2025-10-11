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
import {
  Link as LinkIcon,
  MousePointerClick,
  TrendingUp,
  Users,
} from "lucide-react";

export interface AnalyticsData {
  totalLinks: number;
  totalClicks: number;
  totalParticipants: number;
  totalVisitors: number;
  activeUsers: number;
  topLinks: { slug: string; longUrl: string; clicks: number }[];
}

export function AnalyticsClientPage({
  initialData,
}: {
  initialData: AnalyticsData;
}) {
  return (
    <div className="space-y-8">
      {/* KPI Kartları */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Ziyaretçi (28 Gün)
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {initialData.totalVisitors}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aktif Kullanıcılar (28 Gün)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{initialData.activeUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Kısa Link
            </CardTitle>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{initialData.totalLinks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Tıklanma
            </CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{initialData.totalClicks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Katılımcı
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {initialData.totalParticipants}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popüler Linkler Tablosu */}
      <div>
        <h2 className="text-xl font-semibold mb-4">En Popüler 5 Link</h2>
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kısa Link</TableHead>
                <TableHead>Orijinal Link</TableHead>
                <TableHead className="text-right">Tıklanma</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialData.topLinks.map((link) => (
                <TableRow key={link.slug}>
                  <TableCell className="font-mono text-red-400">
                    /s/{link.slug}
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-gray-400">
                    {link.longUrl}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {link.clicks}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
