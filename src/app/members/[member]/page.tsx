import React from "react";
import { members as membersArray } from "@/constants/members";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const page = ({ params }: { params: { member: any } }) => {
  console.log(params);
  const members = JSON.parse(JSON.stringify(membersArray));

  const select_member = () => {
    return members.find((member: any) => member.id === params.member);
  };

  console.log(select_member);
  return (
    <div>
      <Card className="m-4">
        <CardHeader>
          {select_member().name}

          <Image src={select_member().img} alt="member" width={100} />
        </CardHeader>

        <CardContent>
          <p>{select_member().role}</p>
        </CardContent>

        <CardContent>
          <p>{select_member().desc}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
