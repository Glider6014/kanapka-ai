"use client";

import Subscription from "@/components/home-page/Subscription";
import Footer from "@/components/Footer";
import { MainNavbar } from "@/components/home-page/MainNavbar";
import SubscriptionTable from "@/components/home-page/Subscription_table";
import FAQ from "@/components/home-page/FAQ";


export default function Home() {
  return (
    <>
      <div className="container mx-auto p-4">
        <MainNavbar />
        <div className="flex flex-col items-center md:flex-row gap-4">
          <div className="w-full flex-grow mt-4 md:mt-0">
            <Subscription />
            <SubscriptionTable />
          </div>
        </div>
      </div>
      <div className="w-full">
        <FAQ />
        <Footer />
      </div>
    </>
  );
}
