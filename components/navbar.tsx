"use client";

import { Poppins } from "next/font/google";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { MobileSidebar } from "./mobile-sidebar";

import { cn } from "@/lib/utils";

import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./mode-toggle";
import { useProModal } from "@/hooks/use-pro-modal";

type NavBatProps = {
  isPro?: boolean;
};

const font = Poppins({
  weight: "600",
  subsets: ["latin"],
});

export const NavBar: React.FC<NavBatProps> = ({ isPro }) => {
  const { onOpen } = useProModal();
  return (
    <div className="fixed w-full z-50 flex justify-between items-center py-2 px-4 border-b border-primary/10 bg-secondary h-16">
      <div className="flex items-center">
        <MobileSidebar />
        <Link href="/">
          <h1
            className={cn(
              "hidden md:block text-xl md:text-3xl font-bold text-primary",
              font.className,
            )}
          >
            companion.ai
          </h1>
        </Link>
      </div>
      <div className="flex items-center gap-x-3">
        {!isPro && (
          <Button size="sm" variant="premium" onClick={onOpen}>
            Upgrade <Sparkles className="h-4 w-4 fill-white text-white ml-2" />
          </Button>
        )}
        <ModeToggle />
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};
