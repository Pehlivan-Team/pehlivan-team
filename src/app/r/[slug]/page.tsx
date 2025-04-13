import { redirect } from "next/navigation";
import React from "react";

const opensheet = async (team: string) => {
  const url = `https://opensheet.elk.sh/1fpEpikCHVi58YZBGL6_7zoRxdbjMuDutDvHk5BDhFHE/${team}`;
  fetch(url, { cache: "no-store" })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  return fetch(url).then((response) => response.json());
};

const Redir = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  console.log("slug", slug);
  var slugger;
  if (slug.startsWith("mek")) {
    slugger = "Mekanik";
  } else if (slug.startsWith("gov")) {
    slugger = "Gövde";
  } else if (slug.startsWith("elek")) {
    slugger = "Elektrik";
  } else {
    return <div>404 - Bulunamadı</div>;
  }

  const checklist = await opensheet(slugger);
  const filteredChecklist = checklist.filter((item: any) => item.uuid === slug);
  console.log("filteredChecklist", filteredChecklist);
  if (filteredChecklist.length === 0) {
    return <div>404 - Bulunamadı</div>;
  }
  const item = filteredChecklist[0];
  console.log("item", item);
  redirect(item.link);
  return <div>page</div>;
};

export default Redir;
