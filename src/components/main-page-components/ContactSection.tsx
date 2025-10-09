// src/components/main-page-components/ContactSection.tsx

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, Instagram, Linkedin } from 'lucide-react';

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/pehlivanteam',
    Icon: Instagram,
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/pehlivan-team/',
    Icon: Linkedin,
  },
];

const ContactSection = () => {
  return (
    <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-gray-950 text-white">
      <div className="container mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Info and Socials */}
        <div className="space-y-6 text-center lg:text-left">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              İletişime Geçin
            </h2>
            <p className="max-w-[600px] text-gray-300 md:text-xl lg:mx-0 mx-auto">
              Projemizle ilgileniyor, sponsor olmak istiyor veya ekibimize katılmayı düşünüyorsanız, bize ulaşmaktan çekinmeyin!
            </p>
          </div>
          <div className="flex justify-center lg:justify-start space-x-4">
            {socialLinks.map(({ name, href, Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="text-gray-300 hover:text-red-500 transition-colors"
              >
                <Icon className="h-8 w-8" />
              </a>
            ))}
          </div>
        </div>

        {/* Right Column: Contact Cards */}
        <div className="space-y-6">
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader className="flex-row items-center gap-4">
              <Mail className="h-8 w-8 text-red-500" />
              <CardTitle>Genel Sorular için E-posta</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">Tüm sorularınız ve iş birliği teklifleriniz için bize e-posta gönderin.</p>
              <Button asChild variant="link" className="px-0 text-lg text-red-400 hover:text-red-500">
                <a href="mailto:pehli1team@gmail.com">pehli1team@gmail.com</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <CardHeader className="flex-row items-center gap-4">
              <Phone className="h-8 w-8 text-red-500" />
              <CardTitle>Takım Kaptanı</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">Doğrudan iletişim için Takım Kaptanımız Eşref Kaan Kurtoğlu'na ulaşabilirsiniz.</p>
              <Button asChild variant="link" className="px-0 text-lg text-red-400 hover:text-red-500">
                <a href="tel:+905307617004">+90 530 761 7004</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;