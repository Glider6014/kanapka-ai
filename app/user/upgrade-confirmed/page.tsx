import { UpgradeConfirmedPage } from "@/components/UpgradePlanPage";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default function UpgradeConfirm() {
  const session = getServerSession();

  if (!session) return redirect("/user/signin");

  return <UpgradeConfirmedPage />;
}
