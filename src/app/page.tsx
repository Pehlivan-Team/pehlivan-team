import Motion from "@/components/motion/drag-on-load";
import Image from "next/image";
import logo from "@/assets/logo_png.png";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Award, BatteryCharging, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="bg-gray-950 h-screen w-screen ">
      <section className="bg-gray-900 xl:py-56 py-40 align-middle justify-center items-center flex flex-col">
        <Motion className="flex flex-col " motionDirection="down">
          <div className="flex-col pb-10 flex align-middle justify-center items-center">
            <h1 className="text-white text-6xl font-extrabold">Pehlivan</h1>
            <h1 className="text-white text-6xl font-extrabold">Team</h1>
          </div>
        </Motion>
        <p className="text-white text-xl ">
          Elektrikli araç teknolojisinin sınırlarını zorlayan üniversite
          projesi. Sürdürülebilir ulaşımda devrim yaratmamıza katılın.
        </p>
      </section>

      <section
        id="about"
        className=" max-xl:w-screen py-12 md:py-24 lg:py-32 bg-gray-50 justify-center align-middle text-center"
      >
        <div className="px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
            Projemiz Hakkında
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Motion className="flex flex-col" motionDirection="left">
              <Card>
                <CardContent className="flex flex-col items-center space-y-2 p-6">
                  <BatteryCharging className="h-12 w-12 text-green-500" />
                  <h3 className="text-xl font-bold">
                    Yenilikçi Batarya Teknolojisi
                  </h3>
                  <p className="text-center text-gray-600">
                    Uzun menzil ve daha hızlı şarj için ileri teknoloji batarya
                    çözümleri geliştiriyoruz.
                  </p>
                </CardContent>
              </Card>
            </Motion>
            <Motion className="flex flex-col" motionDirection="down">
              <Card>
                <CardContent className="flex flex-col items-center space-y-2 p-6">
                  <Zap className="h-12 w-12 text-yellow-500" />
                  <h3 className="text-xl font-bold">Verimli Motorlar</h3>
                  <p className="text-center text-gray-600">
                    Gücü ve verimliliği optimize etmek için yüksek verimli
                    Mitsuba motorları kullanıyoruz.
                  </p>
                </CardContent>
              </Card>
            </Motion>
            <Motion className="flex flex-col" motionDirection="right">
              <Card>
                <CardContent className="flex flex-col items-center space-y-2 p-6">
                  <Award className="h-12 w-12 text-blue-500" />
                  <h3 className="text-xl font-bold">Ödüllü Tasarım</h3>
                  <p className="text-center text-gray-600">
                    Form ve işlevi birleştiren şık, aerodinamik araçlar
                    yaratıyoruz.
                  </p>
                </CardContent>
              </Card>
            </Motion>
          </div>
        </div>
      </section>

      <section
        id="achievements"
        className=" bg-slate-200 w-full py-12 md:py-24 lg:py-32"
      >
        <div className="pl-2 pr-2 px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
            Başarılarımız
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">
                  1. Yer - EV İnovasyon Yarışması 2023
                </h3>
                <p className="text-gray-600">
                  Çığır açan batarya yönetim sistemimizle tanındık.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">
                  En İyi Tasarım - Üniversite EV Fuarı
                </h3>
                <p className="text-gray-600">
                  Şık ve verimli araç tasarımımızla ödüllendirildik.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section id="team" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
        <div className="pl-2 pr-2 px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
            Ekibimizle Tanışın
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((member) => (
              <Card key={member}>
                <CardContent className="flex flex-col items-center space-y-2 p-6">
                  <div className="w-24 h-24 rounded-full bg-gray-300" />
                  <h3 className="text-lg font-semibold">
                    Takım Üyesi {member}
                  </h3>
                  <p className="text-sm text-gray-600 text-center">
                    Rol / Uzmanlık
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section
        id="contact"
        className="w-full py-12 md:py-24 lg:py-32 bg-black text-white"
      >
        <div className="pl-2 pr-2 px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Yolculuğumuza Katılın
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-300 md:text-xl">
                Elektrikli araçlar ve sürdürülebilir teknolojiyle ilgileniyor
                musunuz? Daha fazla bilgi almak veya ekibimize katılmak için
                bizimle iletişime geçin!
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2"></div>
            <Button className="w-full bg-white text-black hover:bg-gray-200">
              Bize Ulaşın
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
