import React from "react";
import { members as membersArray } from "@/constants/members";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InstagramLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const page = ({ params }: { params: { member: any } }) => {
  const members = JSON.parse(JSON.stringify(membersArray));
  const select_member = () => {
    return members.find((member: any) => member.id === params.member);
  };

  return (
    <div>
      <Card className="m-4">
        <CardHeader>
          {select_member().name}

          <Image src={select_member().img} alt="member" width={100} height={100} />
        </CardHeader>

        <CardContent>
          <p>{select_member().role}</p>
        </CardContent>

        <CardContent>
          <p>{select_member().desc}</p>
        </CardContent>

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
