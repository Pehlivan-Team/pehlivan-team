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
            <DialogTitle>Hoş Geldiniz</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-lg leading-6 text-gray-600">
            TASARIM VE PROJE TOPLULUĞUNA HOŞ GELDİNİZ! <br />
            <br />
            Topluluğumuz, yenilikçi tasarımlar ve projelerle dolu bir yolculuğa
            çıkmak isteyen bireyler için mükemmel bir platformdur. Burada,
            yaratıcılığınızı ifade edebilir, yeni beceriler öğrenebilir ve
            benzer düşünen insanlarla bağlantı kurabilirsiniz. <br />
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default WelcomeModal;
