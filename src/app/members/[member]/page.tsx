"use client";
import React from "react";
import { members as membersArray } from "@/constants/members";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InstagramLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { motion } from "framer-motion";

const page = ({ params }: { params: { member: any } }) => {
  const members = JSON.parse(JSON.stringify(membersArray));
  const select_member = () => {
    return members.find((member: any) => member.id === params.member);
  };

  const getRandomTransformOrigin = () => {
    const value = (16 + 40 * Math.random()) / 100;
    const value2 = (15 + 36 * Math.random()) / 100;
    return {
      originX: value,
      originY: value2,
    };
  };

  const getRandomDelay = () => -(Math.random() * 0.7 + 0.05);

  const randomDuration = () => Math.random() * 0.07 + 0.23;

  const variants = {
    start: (i: number) => ({
      rotate: i % 2 === 0 ? [-1, 1.3, 0] : [1, -1.4, 0],
      transition: {
        delay: getRandomDelay(),
        repeat: Infinity,
        duration: randomDuration(),
      },
    }),
    reset: {
      rotate: 0,
    },
  };

  return (
    <div className="py-16">
      <Card className="p-4 rounded-t-none border-t-0 border-x-0">
        <CardHeader className="flex flex-col lg:flex-row">
          <div>
            <h1 className="font-bold text-3xl">{select_member().name}</h1>
            <p>{select_member().role}</p>
            <motion.div variants={variants} whileHover={"start"}>
              <Image
                className="rounded-3xl"
                src={select_member().img}
                alt="member"
                width={400}
                height={400}
              />
            </motion.div>
          </div>
          <div className="lg:px-5 px-0 gap-10 lg:py-5">
            {select_member().description.map((desc: string, index: number) => (
              <p key={index} className="py-2">
                {desc}
              </p>
            ))}
          </div>
        </CardHeader>

        <CardContent></CardContent>

        <CardContent className="text-3xl w-10 flex">
          <Link href={select_member().socials.linkedin}>
            <LinkedInLogoIcon className="" width={25} height={25} />
          </Link>
          <Link href={select_member().socials.instagram}>
            <InstagramLogoIcon className="" width={25} height={25} />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
