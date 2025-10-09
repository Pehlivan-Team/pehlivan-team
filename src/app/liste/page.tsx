"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, PlusCircle, Printer } from "lucide-react";
import { QRCodeSVG } from "qrcode.react"; // <-- THIS IS THE FIX: Import the QRCode component
import logo from "@/assets/logo_png.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// --- Type Definitions for our data ---
interface IhtiyacItem {
  part_name: string;
  quantity: string;
  price: string;
  link: string;
  uuid: string;
}

interface TeamData {
  name: string;
  items: IhtiyacItem[];
  total: number;
}

// --- Reusable Components ---

// Button to trigger the print dialog
const PrintButton = () => (
  <Button onClick={() => window.print()} className="print:hidden">
    <Printer className="mr-2 h-4 w-4" />
    Yazdır
  </Button>
);

// Component to display each team's section
const TeamSection = ({ name, items, total }: TeamData) => (
  <div className="border-t-2 border-dashed border-gray-300 pt-6 mt-6">
    <h2 className="text-2xl font-bold mb-4 text-gray-800">{name}</h2>
    <div className="grid grid-cols-1 gap-4">
      {items.map((item, index) => (
        <ItemCard key={index} {...item} />
      ))}
    </div>
    <p className="text-right font-bold text-lg mt-4 text-gray-700">
      Toplam: {total.toFixed(2)} ₺
    </p>
  </div>
);

// Component for a single item card
const ItemCard = (item: IhtiyacItem) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col md:flex-row gap-4 items-start break-inside-avoid">
    <div className="flex-grow">
      <p className="font-bold text-lg text-gray-900">{item.part_name}</p>
      <p className="text-gray-600">Adet: {item.quantity}</p>
      <p className="text-gray-600">Birim Fiyat: {item.price} ₺</p>
      {/* Hide link on print, show on screen */}
      <Link
        href={item.link}
        target="_blank"
        className="text-blue-600 hover:underline print:hidden"
      >
        Ürüne Git →
      </Link>
    </div>
    {/* Show QR code only on print */}
    <div className="block ml-auto">
      <QRCodeSVG value={item.link} size={80} />
    </div>
  </div>
);

// --- Main Page Component ---

const ListePage = () => {
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamData = async (
      teamName: string,
      displayName: string
    ): Promise<TeamData> => {
      const response = await fetch(
        `https://opensheet.elk.sh/1fpEpikCHVi58YZBGL6_7zoRxdbjMuDutDvHk5BDhFHE/${teamName}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch data for ${displayName}`);
      }
      const items: IhtiyacItem[] = await response.json();
      const total = items.reduce(
        (sum, item) => sum + parseFloat(item.price) * parseInt(item.quantity),
        0
      );
      return { name: displayName, items, total };
    };

    const fetchAllData = async () => {
      try {
        const teamNames = [
          { sheetName: "Mekanik", displayName: "Mekanik Departmanı" },
          { sheetName: "Gövde", displayName: "Gövde Departmanı" },
          { sheetName: "Elektrik", displayName: "Elektrik Departmanı" },
        ];
        const allTeamData = await Promise.all(
          teamNames.map((team) =>
            fetchTeamData(team.sheetName, team.displayName)
          )
        );
        setTeams(allTeamData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const grandTotal = teams.reduce((sum, team) => sum + team.total, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Hata: Veri alınamadı. Lütfen daha sonra tekrar deneyin.
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen pt-16">
      <div className="container mx-auto p-4 md:p-8">
        {/* Printable Header */}
        <header className="mb-8">
          <div className="flex justify-between items-center print:hidden">
            <h1 className="text-3xl font-bold text-gray-800">
              İhtiyaç Listesi
            </h1>
            <PrintButton />
          </div>
          <Link href="/liste/add">
            <Button variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Yeni Ürün Ekle
            </Button>
          </Link>
          {/* Header that only shows on the printed page */}
          <div className="hidden print:flex justify-between items-center border-b-2 pb-4 mb-4">
            <div className="flex items-center gap-4">
              <Image
                src={logo}
                alt="Pehlivan Team Logo"
                width={50}
                height={50}
              />
              <h1 className="text-2xl font-bold">
                Pehlivan Team İhtiyaç Listesi
              </h1>
            </div>
            <p className="text-lg">{new Date().toLocaleDateString("tr-TR")}</p>
          </div>
        </header>

        {/* Content */}
        <div className="bg-white/50 p-6 rounded-lg shadow-md">
          {teams.map((team) => (
            <TeamSection key={team.name} {...team} />
          ))}

          {/* Grand Total */}
          <div className="mt-8 pt-4 border-t-4 border-gray-800">
            <p className="text-right text-2xl font-bold text-gray-900">
              Genel Toplam: {grandTotal.toFixed(2)} ₺
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListePage;
