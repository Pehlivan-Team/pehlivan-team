"use client";

import React from "react";
import logo from "@/public/logo_png.png";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { InstagramLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import {
  Mail,
  Trophy,
  Milestone,
  Users,
  Menu as MenuIcon,
  UserPlus,
  LinkIcon,
} from "lucide-react";
import { useActiveSection } from "@/hooks/use-active-section";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AuthButton from "@/components/auth/AuthButton";

const socialLinks = [
  {
    href: "https://www.instagram.com/pehlivanteam",
    Icon: InstagramLogoIcon,
    label: "Instagram",
  },
  {
    href: "https://www.linkedin.com/company/pehlivan-team/",
    Icon: LinkedInLogoIcon,
    label: "LinkedIn",
  },
];

const internalLinks = [
  { href: "/teams", label: "Takımlarımız", Icon: Users },
  { href: "/timeline", label: "Tarihçe", Icon: Milestone },
  { href: "/#achievements", label: "Başarılarımız", Icon: Trophy },
  { href: "/add_member", label: "Topluluğa Katıl", Icon: UserPlus },
  { href: "/#contact", label: "Bize Ulaşın", Icon: Mail },
  { href: "/shortener", label: "Link Kısaltıcı", Icon: LinkIcon },
];

const internalLinkIds = internalLinks.map((link) => link.href);

const Logo = () => (
  <motion.a
    initial={{ rotateZ: 0 }}
    whileHover={{ rotateZ: 360 }}
    transition={{ duration: 0.7, ease: "circInOut" }}
    href="/"
    className="bg-white rounded"
  >
    <Image src={logo} alt="Logo" className="h-10 w-10" />
  </motion.a>
);

// --- CHANGES ARE IN THE TOPBAR COMPONENT ---
const Topbar = () => {
  const activeSection = useActiveSection(internalLinkIds);
  return (
    <header className="fixed top-0 z-50 hidden w-full px-12 lg:block">
      <nav className="flex items-center justify-between h-16 px-8 bg-black/30 backdrop-blur-lg border-b border-white/10 rounded-b-3xl">
        <Logo />
        <div className="flex items-center space-x-6">
          {socialLinks.map(({ href, Icon, label }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-gray-300 transition-colors hover:text-white"
            >
              <Icon className="w-6 h-6" />
            </a>
          ))}
          {/* Updated this section to include icons */}
          {internalLinks.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-x-2 text-gray-300 transition-colors hover:text-white",
                activeSection === href && "font-bold text-red-400"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          ))}
          <div className="h-6 w-px bg-slate-700" />
          <AuthButton /> {/* 3. AuthButton'ı buraya ekle */}
        </div>
      </nav>
    </header>
  );
};

// --- BOTTOMBAR REMAINS THE SAME ---
const BottomBar = () => {
  const activeSection = useActiveSection(internalLinkIds);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const primaryActions = [
    { href: "/add_member", label: "Topluluğa Katıl", Icon: UserPlus },
    { href: "/#contact", label: "Bize Ulaşın", Icon: Mail },
  ];

  const menuLinks = internalLinks.filter(
    (link) => !primaryActions.some((action) => action.href === link.href)
  );

  return (
    <footer className="fixed bottom-0 z-50 w-full px-2 lg:hidden print:hidden">
      <nav className="flex items-center justify-between h-16 px-4 bg-black/30 backdrop-blur-lg border-t border-white/10 rounded-t-3xl">
        <Logo />

        <div className="flex items-center gap-x-2">
          <TooltipProvider delayDuration={0}>
            {primaryActions.map(({ href, Icon, label }) => (
              <Tooltip key={href}>
                <TooltipTrigger asChild>
                  <Link
                    href={href}
                    className={cn(
                      "p-2 rounded-full transition-colors",
                      activeSection === href
                        ? "bg-red-500/50 text-white"
                        : "text-gray-300 hover:bg-white/10"
                    )}
                  >
                    <Icon className="w-6 h-6" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{label}</p>
                </TooltipContent>
              </Tooltip>
            ))}

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-300 hover:bg-white/10 hover:text-white"
                    >
                      <MenuIcon className="w-6 h-6" />
                    </Button>
                  </SheetTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Daha Fazla</p>
                </TooltipContent>
              </Tooltip>
              <SheetContent className="bg-gray-950/90 backdrop-blur-lg border-l-slate-700 text-white">
                <SheetHeader>
                  <SheetTitle className="text-white text-2xl">Menü</SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col space-y-4">
                  {menuLinks.map(({ href, label, Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setIsSheetOpen(false)}
                      className={cn(
                        "flex items-center gap-4 text-lg p-2 rounded-md transition-colors",
                        activeSection === href
                          ? "bg-red-500/50 text-white"
                          : "hover:bg-slate-800"
                      )}
                    >
                      <Icon className="w-6 h-6" />
                      <span>{label}</span>
                    </Link>
                  ))}
                </div>
                <div className="absolute bottom-8 left-6 flex space-x-6">
                  {socialLinks.map(({ href, Icon, label }) => (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white"
                    >
                      <Icon className="w-7 h-7" />
                    </a>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </TooltipProvider>
        </div>
      </nav>
    </footer>
  );
};

export { Topbar, BottomBar };
