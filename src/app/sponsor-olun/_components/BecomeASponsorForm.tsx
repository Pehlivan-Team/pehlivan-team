import { Card } from "@/components/ui/card";
import React from "react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
const BecomeASponsorForm = () => {
  return (
    <div className="p-6 mx-auto z-20 bg-gradient-to-t from-blue-500/30 to-red-400/60 text-white font-semibold py-1 px-1 rounded ">
      <div className="max-w-md mx-auto bg-gray-500/80 p-16 rounded-lg shadow-lg h-full">
        <h1>Sponsor Olun</h1>
        <form>
          <Item>
            <ItemHeader>
              <ItemTitle>Full Name</ItemTitle>
            </ItemHeader>
            <ItemContent>
              <Input type="text" name="fullName" />
            </ItemContent>
          </Item>
          <Item>
            <ItemHeader>
              <ItemTitle>Email</ItemTitle>
            </ItemHeader>
            <ItemContent>
              <Input type="email" name="email" />
            </ItemContent>
          </Item>
          <Item>
            <ItemFooter>
              <Button variant="outline" type="submit">Submit</Button>
            </ItemFooter>
          </Item>
        </form>
      </div>
    </div>
  );
};

export default BecomeASponsorForm;
