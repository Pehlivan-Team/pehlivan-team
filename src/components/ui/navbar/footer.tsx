import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Github, Instagram, Linkedin, LinkIcon, Mail, Milestone, Trophy, UserPlus, Users } from "lucide-react";
import logo from "@/assets/logo_png.png";

const Footer = () => {
  const quickLinks = [
  { href: "/teams", label: "Takımlarımız", Icon: Users },
  { href: "/timeline", label: "Tarihçe", Icon: Milestone },
  { href: "/#achievements", label: "Başarılarımız", Icon: Trophy },
  { href: "/add_member", label: "Topluluğa Katıl", Icon: UserPlus },
  { href: "/#contact", label: "Bize Ulaşın", Icon: Mail },
  { href: "/shortener", label: "Link Kısaltıcı", Icon: LinkIcon },
];

  const socialLinks = [
    {
      href: "https://www.instagram.com/pehlivanteam",
      label: "Instagram",
      Icon: Instagram,
    },
    {
      href: "https://www.linkedin.com/company/pehlivan-team/",
      label: "LinkedIn",
      Icon: Linkedin,
    },
    {
      href: "https://github.com/Pehlivan-Team",
      label: "GitHub",
      Icon: Github,
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-slate-800 pb-16 sm:pb-0 md:pb-0 lg:pb-0 xl:pb-0 print:hidden">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          {/* Column 1: Logo and About */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="bg-white p-1 rounded">
                <Image
                  src={logo}
                  alt="Pehlivan Team Logo"
                  width={40}
                  height={40}
                />
              </div>
              <span className="font-bold text-xl text-white">
                Pehlivan Team
              </span>
            </Link>
            <p className="text-sm max-w-xs">
              Trakya Üniversitesi Tasarım ve Proje Topluluğu. Sürdürülebilir
              teknoloji ve yenilikçi mühendislik.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-semibold text-white tracking-wider uppercase">
              Hızlı Erişim
            </h3>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-red-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Social Media */}
          <div>
            <h3 className="font-semibold text-white tracking-wider uppercase">
              Bizi Takip Edin
            </h3>
            <div className="mt-4 flex justify-center md:justify-start space-x-6">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="hover:text-red-400 transition-colors"
                >
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar for Copyright */}
      <div className="bg-black/50 py-4">
        <div className="container mx-auto px-6 text-center text-sm text-gray-400">
          &copy; {currentYear} Pehlivan Team. Tüm hakları saklıdır. Designed by{" "}
          <Link href="https://github.com/anshinx">anshinx</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
