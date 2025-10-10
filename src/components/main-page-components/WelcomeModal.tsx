"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/public/logo_png.png";
import { useRouter } from "next/navigation";

function WelcomeModal({ show }: { show: boolean }) {
  const [isOpen, setIsOpen] = useState(show);
  const router = useRouter();

  useEffect(() => {
    setIsOpen(show);
  }, [show]);

  const handleClose = () => {
    setIsOpen(false);
    // Use router.replace to remove the '?welcome=true' from the URL without reloading
    router.replace("/", { scroll: false });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent className="bg-slate-900/80 backdrop-blur-sm border-slate-700 text-white shadow-2xl max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <DialogHeader className="flex flex-col items-center text-center gap-4">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Image src={logo} alt="Pehlivan Team Logo" width={100} height={100} />
                </motion.div>
                <DialogTitle className="text-3xl font-bold">
                  Aramıza Hoş Geldin!
                </DialogTitle>
              </DialogHeader>
              <DialogDescription className="text-base leading-relaxed text-gray-300 mt-4 px-2 max-h-[60vh] overflow-y-auto">
                <p>
                  Tasarım ve Proje Topluluğu (Pehlivan Team) ailesine katıldığın için çok heyecanlıyız! Başvuru formunu doldurarak, köklü bir geçmişe ve büyük hedeflere sahip bu ekibin bir parçası olmak için ilk adımı attın. Bu cesaretin ve tutkun için seni gönülden tebrik ederiz.
                </p>
                <br />
                <p>
                  Yolculuğumuz, 2013'te TÜBİTAK'ın prestijli Efficiency Challenge EV yarışlarına katılma hedefiyle başladı. Bugün ise Roket Takımımız, Otonom Araç ve Linux Takımlarımızla birlikte multidisipliner, güçlü bir aileyiz.
                </p>
                <br />
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-lg text-white mb-2">Peki şimdi ne olacak?</h4>
                  <p>
                    Ekibimiz en kısa sürede başvurunu inceleyecek ve ilgili birimlerimiz seninle iletişime geçecektir. Süreçle ilgili tüm bilgilendirmeler için yakında paylaşacağımız iletişim kanallarımızı takip etmeyi unutma.
                  </p>
                </div>
                <br />
                <p className="font-bold text-lg text-center text-red-400">
                  Maceraya hazır ol!
                </p>
                <br/>
                <p className="text-sm text-center">
                  Saygı ve sevgilerimizle,
                  <br />
                  <span className="font-semibold">Tasarım ve Proje Topluluğu | Pehlivan Team Yönetimi</span>
                </p>
              </DialogDescription>

              <div className="mt-6 flex justify-center">
                <Button onClick={handleClose} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg">
                  Harika!
                </Button>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

export default WelcomeModal;