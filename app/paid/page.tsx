export const runtime = "nodejs";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function PaidPage() {
  const session = await getSession();
  if (!session.user || !session.user.isPaid) {
    redirect("/");
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(34,197,94,0.10)_0%,rgba(34,197,94,0)_60%)]" />
      <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-zinc-900/60 backdrop-blur p-8 shadow-[0_1px_0_0_rgba(0,0,0,0.06),0_1px_3px_0_rgba(0,0,0,0.08)] space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          <span className="bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-white dark:to-zinc-300">
            Paid Area
          </span>
        </h1>
        <p className="text-zinc-600 dark:text-zinc-300">Welcome to the paid content area. Replace this with real content later.</p>
      </div>
    </div>
  );
}


