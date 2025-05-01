import Link from "next/link";
import React, { cache } from "react";

const opensheet = async (team: string) => {
  const url = `https://opensheet.elk.sh/1fpEpikCHVi58YZBGL6_7zoRxdbjMuDutDvHk5BDhFHE/${team}`;
  fetch(url, { cache: "no-store" })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  return fetch(url).then((response) => response.json());
};

const createLink = (uuid: string) => {
  const url = `https://pehli1team.com/r/${uuid}`;
  return url;
};

const Liste = async () => {
  const mekanikList = await opensheet("Mekanik");
  const govdeList = await opensheet("Gövde");
  const elektrikList = await opensheet("Elektrik");

  console.log("liste ", elektrikList);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen pb-16 bg-gray-100">
      <h1 className="text-xl font-bold ">Pehlivan Team İhtiyaç Listesi</h1>
      <div className="flex flex-col">
        <div className="flex lg:flex-row flex-col gap-3 border-black border-2 rounded-sm p-4 mt-4">
          <div className="flex flex-col">
            <h2 className="text-lg font-bold">Mekanik</h2>
            {mekanikList.map((item: any) => (
              <div
                key={item.part_name}
                className="flex flex-col pb-1 border-b-2 border-black"
              >
                <div className="flex flex-row gap-3">
                  <p key={item.part_name}>{item.part_name}</p>
                  <p>x{item.quantity}</p>
                  <p>{item.price}₺</p>
                </div>

                <Link href={createLink(item.uuid)}>
                  {createLink(item.uuid)}
                </Link>
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-bold">Gövde</h2>
            {govdeList.map((item: any) => (
              <div
                key={item.part_name}
                className="flex flex-col pb-1 border-b-2 border-black"
              >
                <div className="flex flex-row gap-3">
                  <p key={item.part_name}>{item.part_name}</p>
                  <p>x{item.quantity}</p>
                  <p>{item.price}₺</p>
                </div>

                <Link href={createLink(item.uuid)}>
                  {createLink(item.uuid)}
                </Link>
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-bold">Elektrik</h2>
            {elektrikList.map((item: any) => (
              <div
                key={item.part_name}
                className="flex flex-col pb-1 border-b-2 border-black"
              >
                <div className="flex flex-row gap-3">
                  <p key={item.part_name}>{item.part_name}</p>
                  <p>x{item.quantity}</p>
                  <p>{item.price}₺</p>
                </div>
                <Link href={createLink(item.uuid)}>
                  {createLink(item.uuid)}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Liste;
