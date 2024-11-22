import { Navbar } from "@/components/Navbar";
import ListIngredientsAndListRecipesSection from "@/components/sections/ListIngredientsAndListRecipesSection";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import authOptions from "@/lib/nextauth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/user/signin");
  }

  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <ListIngredientsAndListRecipesSection />
    </div>
  );
}
