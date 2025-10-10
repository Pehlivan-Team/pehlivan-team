"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export const PrintButton = () => {
    return (
        <Button className="text-black border-black" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4 text-black" />
            Yazdır
        </Button>
    );
};