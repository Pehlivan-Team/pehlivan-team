"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Participant } from "../page";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";
import { useDebounce } from "use-debounce";
import { cn } from "@/lib/utils";

export function MembersClientPage({
  initialParticipants,
  totalPages,
  currentPage,
  allTeams,
}: {
  initialParticipants: Participant[];
  totalPages: number;
  currentPage: number;
  allTeams: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Arama kutusu için state
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  // Kullanıcı yazmayı bıraktıktan sonra arama yapmak için debounced state
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  // Arama terimi değiştiğinde URL'i güncelleyen ve 1. sayfaya dönen useEffect
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", debouncedSearchTerm);
    if (!debouncedSearchTerm) {
      params.delete("search");
    } // Arama yapıldığında her zaman 1. sayfaya dön
    if (currentPage !== 1 && debouncedSearchTerm) {
      params.set("page", "1");
    }
    router.push(`${pathname}?${params.toString()}`);
  }, [debouncedSearchTerm, pathname, router]);

  // Takım filtresi değiştiğinde URL'i güncelleyen ve 1. sayfaya dönen fonksiyon
  const handleTeamFilterChange = (team: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentTeam = searchParams.get("team");

    if (team === currentTeam || !team) {
      params.delete("team");
    } else {
      params.set("team", team);
    }
    params.set("page", "1"); // Filtre değiştiğinde her zaman 1. sayfaya dön
    router.push(`${pathname}?${params.toString()}`);
  };

  const teamFilter = searchParams.get("team") || "";

  // Sayfalama linkleri için URL oluşturan yardımcı fonksiyon
  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(pageNumber));
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder="İsim, bölüm veya öğrenci no ile ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-10 gap-1">
              <ListFilter className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                {teamFilter ? `Takım: ${teamFilter}` : "Takıma Göre Filtrele"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-slate-500">
            <DropdownMenuRadioGroup
              value={teamFilter}
              onValueChange={handleTeamFilterChange}
            >
              <DropdownMenuRadioItem value="">
                Tüm Takımlar
              </DropdownMenuRadioItem>
              <DropdownMenuSeparator />
              {allTeams.map((team) => (
                <DropdownMenuRadioItem key={team} value={team}>
                  {team}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>İsim Soyisim</TableHead>
              <TableHead>Bölüm</TableHead>
              <TableHead>Takım</TableHead>
              <TableHead>Öğrenci No</TableHead>
              <TableHead>İletişim</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialParticipants.map((p, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.department}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "font-semibold",
                      p.team == "Pehli1"
                        ? "text-red-400"
                        : p.team == "Roket"
                        ? "text-blue-400"
                        : p.team == "PR"
                        ? "text-white"
                        : p.team == "Börü"
                        ? "text-yellow-400"
                        : "text-green-400"
                    )}
                  >
                    {p.team}
                  </span>
                </TableCell>
                <TableCell>{p.student_number}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {p.email || p.phone}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {initialParticipants.length === 0 && (
          <p className="text-center text-gray-400 p-8">
            Bu kriterlere uygun katılımcı bulunamadı.
          </p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={createPageURL(currentPage - 1)}
                  className={
                    currentPage <= 1
                      ? "pointer-events-none opacity-50"
                      : undefined
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href={createPageURL(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  href={createPageURL(currentPage + 1)}
                  className={
                    currentPage >= totalPages
                      ? "pointer-events-none opacity-50"
                      : undefined
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
