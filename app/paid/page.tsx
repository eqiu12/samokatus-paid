export const runtime = "nodejs";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function PaidPage() {
  const session = await getSession();
  if (!session.user || !session.user.isPaid) {
    redirect("/");
  }

  const pages = await prisma.page.findMany({
    where: { published: true, isPaidOnly: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, slug: true, createdAt: true },
  });

  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(34,197,94,0.10)_0%,rgba(34,197,94,0)_60%)]" />
      <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-zinc-900/60 backdrop-blur p-8 shadow-[0_1px_0_0_rgba(0,0,0,0.06),0_1px_3px_0_rgba(0,0,0,0.08)] space-y-5">
        <h1 className="text-3xl font-semibold tracking-tight">
          <span className="bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-white dark:to-zinc-300">
            Paid Area
          </span>
        </h1>
        {pages.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-300">No paid articles yet.</p>
        ) : (
          <div className="grid gap-3">
            {pages.map((p) => (
              <a
                key={p.id}
                href={`/${p.slug}`}
                className="group rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-zinc-900/50 backdrop-blur px-4 py-3 flex items-center justify-between hover:border-black/20 dark:hover:border-white/20 transition-colors"
              >
                <div>
                  <div className="font-medium tracking-tight group-hover:underline underline-offset-4">
                    {p.title}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">/{p.slug}</div>
                </div>
                <span aria-hidden className="text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition-colors">→</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


