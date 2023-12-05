import React from "react";

import { NavBar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { checkSubscription } from "@/lib/subscription";

const RootLayout: React.FC<{ children: React.ReactNode }> = async ({
  children,
}) => {
  const isPro = await checkSubscription();

  return (
    <div className="h-full">
      <NavBar isPro={isPro} />
      <div className="hidden md:flex mt-16 w-20 flex-col fixed inset-y-0">
        <Sidebar isPro={isPro} />
      </div>
      <main className="md:pl-20 pt-16 h-full">{children}</main>
    </div>
  );
};

export default RootLayout;
