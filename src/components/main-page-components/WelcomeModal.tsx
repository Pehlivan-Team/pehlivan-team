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

function WelcomeModal() {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <div className="z-50 absolute">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle>Hoş Geldiniz</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            TASARIM VE PROJE TOPLULUĞUNA HOŞ GELDİNİZ! <br />
            <br />
            Topluluğumuz, yenilikçi tasarımlar ve projelerle dolu bir yolculuğa
            çıkmak isteyen bireyler için mükemmel bir platformdur. Burada,
            yaratıcılığınızı ifade edebilir, yeni beceriler öğrenebilir ve
            benzer düşünen insanlarla bağlantı kurabilirsiniz. <br />
          </DialogDescription>
        </DialogContent>
        <DialogClose asChild>
          <Button
            onClick={() => {
              setIsOpen(false);
            }}
            variant="outline"
          >
            Cancel
          </Button>
        </DialogClose>
      </Dialog>
    </div>
  );
}

export default WelcomeModal;
