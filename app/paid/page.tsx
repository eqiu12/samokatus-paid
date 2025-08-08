import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function PaidPage() {
  const session = await getSession();
  if (!session.user || !session.user.isPaid) {
    redirect("/");
  }

  return (
    <div className="max-w-xl mx-auto p-8 space-y-4">
      <h1 className="text-2xl font-semibold">Paid Area</h1>
      <p>Welcome to the paid content area. Replace this with real content later.</p>
    </div>
  );
}


