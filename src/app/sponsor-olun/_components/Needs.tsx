"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CheckCircle, Handshake, Mail } from "lucide-react";
import Link from "next/link";
import Sponsors from "@/constants/sponsors";
import Image from "next/image";

// Veri Tipleri (Sayfanın bu tiplere ihtiyacı var)
interface IhtiyacItem {
  part_name: string;
  quantity: number;
  price: number;
  link: string;
}

interface TeamData {
  name: string;
  items: IhtiyacItem[];
  total: number;
}

// Prop tiplerini tanımlıyoruz
interface SponsorClientPageProps {
  needs: TeamData[];
  grandTotal: number;
}

// Sponsorluk Seviyeleri (Bu bilgi sunucuya bağımlı değil)
const sponsorshipTiers = [
  {
    name: "Ana Sponsor",
    price: "100.000 TL+",
    features: [
      "Araç İsmini belirleme",
      "Araç üzerinde büyük boyutta logo",
      "Sosyal medyada ve web sitesinde özel tanıtım",
      "Tüm etkinliklerde ve fuarlarda görünürlük",
      "Basın bültenlerinde yer alma",
      "Aracın firma etkinliklerine katılıması",
    ],
  },
  {
    name: "Altın Sponsor",
    price: "40.000 TL+",
    features: [
      "Araç üzerinde orta boyutta logo",
      "Sosyal medyada ve web sitesinde tanıtım",
      "Belirli etkinliklerde görünürlük",
    ],
  },
  {
    name: "Gümüş Sponsor",
    price: "20.000 TL+",
    features: [
      "Araç üzerinde küçük boyutta logo",
      "Web sitesinde 'Destekçilerimiz' bölümünde yer alma",
    ],
  },
  {
    name: "Bronz Sponsor",
    price: "7500 TL+",
    features: ["Web sitemizde 'Destekçilerimiz' bölümünde yer alma"],
  },
];

export default function SponsorClientPage({
  needs,
  grandTotal,
}: SponsorClientPageProps) {
  return (
    <div className="bg-gray-950 min-h-screen text-white">
      {/* Header */}
      <header className="pt-32 pb-16 bg-[#101b40] text-center">
        <div className="container mx-auto px-4">
          <Handshake className="h-16 w-16 mx-auto text-red-500 mb-4" />
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter">
            Bize Sponsor Olun
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-gray-300">
            Yenilikçi projelerimizi hayata geçirmemize yardımcı olun, geleceğin
            mühendislerine yatırım yapın ve markanızı binlerce kişiye duyurun.
          </p>
        </div>
      </header>

      <main className="container mx-auto py-16 px-4">
        {/* Sponsorluk Seviyeleri */}
        <section id="tiers">
          <h2 className="text-3xl font-bold text-center mb-10">
            Sponsorluk Seviyeleri
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sponsorshipTiers.map((tier) => (
              <Card
                key={tier.name}
                className="bg-slate-800/60 border-slate-700 flex flex-col"
              >
                <CardHeader>
                  <CardTitle className="text-2xl text-red-400">
                    {tier.name}
                  </CardTitle>
                  <CardDescription className="text-xl font-bold text-white">
                    {tier.price}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* İhtiyaç Listesi */}
        <section id="needs" className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-10">
            Güncel İhtiyaç Listemiz
          </h2>
          <div className="bg-slate-800/60 p-6 rounded-lg border border-slate-700">
            <Accordion type="single" collapsible className="w-full">
              {needs.map((team) => (
                <AccordionItem
                  value={team.name}
                  key={team.name}
                  className="border-b-2 border-dashed border-gray-600 last:border-b-0"
                >
                  <AccordionTrigger className="text-xl font-bold text-red-400 hover:no-underline">
                    <span className="flex-1 text-left">{team.name}</span>
                    <span className="mr-4 text-white">
                      {team.total.toFixed(2)} ₺
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 pt-4">
                      {team.items.map((item, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center bg-slate-900/50 p-3 rounded"
                        >
                          <span className="font-medium">{item.part_name}</span>
                          <span className="text-gray-400">
                            {item.quantity} adet -{" "}
                            {(item.price * item.quantity).toFixed(2)} ₺
                          </span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="mt-8 pt-4 border-t-2 border-red-500">
              <p className="text-right text-2xl font-bold">
                Genel Toplam: {grandTotal.toFixed(2)} ₺
              </p>
            </div>
          </div>
        </section>

        {/* Mevcut Sponsorlar */}
        <section id="current-sponsors" className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-10">
            Mevcut Sponsorlarımız
          </h2>
          <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
            <div className="flex flex-wrap justify-center items-center gap-8">
              {Sponsors.map((sponsor) => (
                <Link
                  key={sponsor.name}
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative h-24 w-48 transition-transform hover:scale-110"
                >
                  <Image
                    src={sponsor.logo}
                    alt={`${sponsor.name} logo`}
                    layout="fill"
                    objectFit="contain"
                    className=""
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* İletişim */}
        <section id="contact-us" className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Hazır mısınız?</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            Geleceği birlikte inşa etmek ve bu heyecan verici yolculuğun bir
            parçası olmak için bizimle iletişime geçin.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Link href="mailto:pehli1team@gmail.com">
              <Mail className="mr-2 h-5 w-5" /> E-posta Gönderin
            </Link>
          </Button>
        </section>
      </main>
    </div>
  );
}
