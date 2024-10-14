import Motion from "@/components/motion/drag-on-load";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Award, BatteryCharging, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo_png.png";
import Image from "next/image";

export default function Home() {
  const members = [
    {
      name: "Fatih Coşar",
      role: "Takım Kaptanı / Makine Mühendisliği",
      img: logo,
    },
    {
      name: "Yener Süphan Güneş",
      role: "Elektrik ve Yazılım Başkanı/Elektrik-Elektronik Mühendisliği",
      img: logo,
    },
    {
      name: "Ozan Çağan Işık",
      role: "Tasarım Başkanı / Makine Mühendisliği",
      img: logo,
    },
    {
      name: "Kaan Yılmaz",
      role: "Analiz Başkanı / Makine Mühendisliği",
      img: logo,
    },
    {
      name: "Mert Kılıç",
      role: "Gövde Tasarım Başkanı / Makine Mühendisliği",
      img: logo,
    },
    {
      name: "Mirza Berk Demirtaş",
      role: "Mekanik Başkanı / Makine Mühendisliği",
      img: logo,
    },
    {
      name: "Eşref Kaan Kurtoğlu",
      role: "Gövde Sorumlusu /Makine Mühendisliği",
      img: logo,
    },
    {
      name: "Emirhan Fidan",
      role: "Mekanik Sorumlusu /Makine Mühendisliği",
      img: logo,
    },
    {
      name: "Emir Yavuz",
      role: "Mekanik Sorumlusu /Makine Mühendisliği",
      img: logo,
    },
  ];
  return (
    <div className="bg-gray-950 h-screen w-screen ">
      <section className="bg-gray-900 xl:pb-56 pb-40 align-middle justify-center items-center flex flex-col">
        <Motion className="flex flex-col " motionDirection="down">
          <div className="flex-col pb-10 flex align-middle justify-center items-center">
            <Image src={logo} alt="Logo" width={300} height={100} />
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">
                  Tübitak Efficiency Challenge - 2015
                </h3>
                <p className="text-gray-600">Tasarım Ödüllü</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">
                  FormulaG Güneş Arabaları Yarışı - 2014
                </h3>
                <p className="text-gray-600">Kurul Özel Ödülü</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">
                  FormulaG Güneş Arabaları Yarışı - 2014
                </h3>
                <p className="text-gray-600">Üçünülük Ödülü</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">
                  Tübitak Efficiency Challenge - 2016
                </h3>
                <p className="text-gray-600">İkincilik Ödülü</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">
                  Tübitak Efficiency Challenge - 2016
                </h3>
                <p className="text-gray-600">
                  Communication Award - En İyi Sunum Ödülü
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
            {members.map((member) => (
              <Card key={member.name}>
                <CardContent className="flex flex-col items-center space-y-2 p-6">
                  <div className="w-24 h-24 rounded-full bg-gray-300">
                    <Image
                      src={member.img}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-sm text-gray-600 text-center">
                    {member.role}
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
