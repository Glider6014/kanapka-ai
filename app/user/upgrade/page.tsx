import { UpgradePlanPage } from "@/components/UpgradePlanPage";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default function UpgradePlan() {
  const session = getServerSession();

  if (!session) return redirect("/user/signin");

  return <UpgradePlanPage />;
}
