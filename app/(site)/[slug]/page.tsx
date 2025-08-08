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
    <div className="max-w-2xl mx-auto p-8 space-y-4">
      <h1 className="text-2xl font-semibold">{page.title}</h1>
      <article className="prose dark:prose-invert">
        <div dangerouslySetInnerHTML={{ __html: page.content }} />
      </article>
    </div>
  );
}


