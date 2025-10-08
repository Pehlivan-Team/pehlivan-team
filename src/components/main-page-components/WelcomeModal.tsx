import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import logo from "@/assets/logo_png.png";
import Image from "next/image";
import { motion } from "framer-motion";

function WelcomeModal({ show }: { show: boolean }) {
  const [isOpen, setIsOpen] = React.useState(show);

  return (
    <div className="z-50 absolute">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className=" bg-white  rounded-lg shadow-lg max-w-3xl">
          <DialogHeader className="flex flex-row items-center gap-4">
            <motion.div
              initial={{ opacity: 1, y: -20, rotateZ: -25 }}
              animate={{ y: 0, rotateZ: 25 }}
              transition={{
                duration: 2,
                delay: 0.1,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <Image src={logo} alt="Logo" width={100} height={100} />
            </motion.div>
            <DialogTitle> Aramıza Hoş Geldin </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-lg leading-6 text-gray-600">
            Tasarım ve Proje Topluluğu (Pehlivan Team) ailesine katıldığın için
            çok heyecanlıyız! Başvuru formunu doldurarak, köklü bir geçmişe ve
            büyük hedeflere sahip bu ekibin bir parçası olmak için ilk adımı
            attın. Bu cesaretin ve tutkun için seni gönülden tebrik ederiz.
            <br />
            <br />
            Yolculuğumuz, 2013 yılında TÜBİTAK'ın prestijli Efficiency Challenge
            EV yarışlarına katılma hedefiyle yola çıkan bir elektrikli araç
            takımı olarak başladı. O günden bugüne, Trakya'nın "Pehlivan" ruhunu
            teknoloji ve mühendislikle birleştirerek büyümeye ve gelişmeye devam
            ettik.
            <br />
            <br />
            Bugün ise sadece elektrikli araçlarla sınırlı değiliz. Ufuklarını
            gökyüzüne çeviren Roket Takımımız, geleceğin teknolojisini
            şekillendiren Otonom Araç ve Linux Takımlarımız ve tüm bu başarı
            hikayemizi dünyaya duyuran dinamik Halkla İlişkiler (PR) Grubumuzla
            birlikte multidisipliner, güçlü bir aileyiz.
            <br />
            <br />
            Şimdi sen de bu büyük mirasın ve heyecan verici geleceğin bir
            parçasısın. Fikirlerinle, yeteneklerinle ve enerjinle topluluğumuza
            büyük değer katacağına ve birlikte nice başarılara imza atacağımıza
            eminiz.
            <br />
            <br />
            Peki şimdi ne olacak?
            <br />
            Ekibimiz en kısa sürede başvurunu inceleyecek ve ilgili birimlerimiz
            seninle iletişime geçecektir. Süreçle ilgili tüm bilgilendirmeler ve
            topluluk içi duyurular için yakında paylaşacağımız iletişim
            kanallarımızı (WhatsApp, Discord vb.) takip etmeyi unutma.
            <br />
            <br />
            Maceraya hazır ol!
            <br />
            <br />
            Saygı ve sevgilerimizle,
            <br />
            Tasarım ve Proje Topluluğu | Pehlivan Team Yönetimi
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default WelcomeModal;
