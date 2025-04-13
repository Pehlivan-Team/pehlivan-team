import React from "react";
import logo from "@/assets/logo_png.png";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { members as membersArray } from "@/constants/members";

const Members = () => {
  const members = JSON.parse(JSON.stringify(membersArray));

  return (
    <div>
      <section id="team" className="w-full py-24 md:py-24 lg:py-32 bg-gray-100">
        <div className="pl-2 pr-2 px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
            Ekibimizle Tanışın
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {members.map((member: any) => (
              <a key={member.name} className="" href={`/members/${member.id}`}>
                <Card key={member.name}>
                  <CardContent className="flex flex-col items-center space-y-2 p-6">
                    <div className="w-24 h-24 rounded-full bg-gray-300">
                      <Image
                        src={member.img}
                        alt={member.name}
                        className="w-full h-full object-cover rounded-full"
                        width={400}
                        height={400}
                      />
                    </div>
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <p className="text-sm text-gray-600 text-center">
                    {member.role.split("/")
                        ? member.role.split("/")[0]
                        : member.role}
                    </p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Members;
