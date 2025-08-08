export const runtime = "nodejs";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = await prisma.page.findUnique({ where: { slug } });

  if (!page || !page.published) {
    redirect("/");
  }

  if (page.isPaidOnly) {
    const session = await getSession();
    if (!session.user || !session.user.isPaid) {
      redirect("/");
    }
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(59,130,246,0.08)_0%,rgba(59,130,246,0)_60%)]" />
      <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-zinc-900/60 backdrop-blur p-8 shadow-[0_1px_0_0_rgba(0,0,0,0.06),0_1px_3px_0_rgba(0,0,0,0.08)]">
        <h1 className="text-3xl font-semibold tracking-tight mb-4">
          <span className="bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-white dark:to-zinc-300">
            {page.title}
          </span>
        </h1>
        <article className="prose dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </article>
      </div>
    </div>
  );
}


