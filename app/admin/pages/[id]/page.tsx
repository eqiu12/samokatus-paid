export const runtime = "nodejs";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import HtmlEditor from "@/components/HtmlEditor";
import Link from "next/link";

type Props = { params: Promise<{ id: string }> };

export default async function EditPage({ params }: Props) {
  const { id } = await params;
  const session = await getSession();
  if (!session.user || session.user.role !== "ADMIN") redirect("/");

  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) redirect("/admin");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Edit: {page.title}</h1>
      <form action={updatePage} className="flex flex-col gap-3 border rounded p-3">
        <input type="hidden" name="id" value={page.id} />
        <label className="space-y-1">
          <span className="text-sm">Title</span>
          <input className="border p-2 rounded w-full" name="title" defaultValue={page.title} required />
        </label>
        <label className="space-y-1">
          <span className="text-sm">Slug</span>
          <input className="border p-2 rounded w-full" name="slug" defaultValue={page.slug} required />
        </label>
        <HtmlEditor name="content" label="Content" initialHtml={page.content} />
        <label className="flex items-center gap-2">
          <input type="checkbox" name="published" defaultChecked={page.published} /> Published
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isPaidOnly" defaultChecked={page.isPaidOnly} /> Paid-only
        </label>
        <div className="flex gap-2">
          <button className="px-3 py-2 border rounded" type="submit">Save</button>
          <Link className="underline underline-offset-4" href="/admin">Back</Link>
        </div>
      </form>
    </div>
  );
}

async function updatePage(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session.user || session.user.role !== "ADMIN") redirect("/");

  const id = String(formData.get("id"));
  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const published = formData.get("published") === "on";
  const isPaidOnly = formData.get("isPaidOnly") === "on";

  if (!id || !title || !slug) redirect("/admin");
  await prisma.page.update({ where: { id }, data: { title, slug, content, published, isPaidOnly } });
  revalidatePath("/admin");
  redirect("/admin");
}


