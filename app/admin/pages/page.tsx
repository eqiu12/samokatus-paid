export const runtime = "nodejs";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import HtmlEditor from "@/components/HtmlEditor";
import Link from "next/link";

export default async function AdminPages() {
  const session = await getSession();
  if (!session.user || session.user.role !== "ADMIN") redirect("/");

  const pages = await prisma.page.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Pages</h1>

      <form action={createPage} className="flex flex-col gap-3 border rounded p-3">
        <input className="border p-2 rounded" name="title" placeholder="Title" required />
        <input className="border p-2 rounded" name="slug" placeholder="Slug (e.g. about)" required />
        <HtmlEditor name="content" label="Content" />
        <label className="flex items-center gap-2">
          <input type="checkbox" name="published" /> Published
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isPaidOnly" /> Paid-only
        </label>
        <button className="px-3 py-2 border rounded w-fit" type="submit">Create Page</button>
      </form>

      <div className="space-y-3">
        {pages.map((p) => (
          <div key={p.id} className="border rounded p-3">
            <div className="font-medium">{p.title} — /{p.slug}</div>
            <div className="text-sm text-gray-600">{p.published ? "Published" : "Draft"} · {p.isPaidOnly ? "Paid-only" : "Public"}</div>
            <div className="flex gap-2 pt-2">
              <Link className="underline" href={`/admin/pages/${p.id}`}>Edit</Link>
              <form action={togglePublish}>
                <input type="hidden" name="pageId" value={p.id} />
                <input type="hidden" name="to" value={(!p.published).toString()} />
                <button className="px-3 py-2 border rounded" type="submit">
                  {p.published ? "Unpublish" : "Publish"}
                </button>
              </form>
              <form action={togglePaidOnly}>
                <input type="hidden" name="pageId" value={p.id} />
                <input type="hidden" name="to" value={(!p.isPaidOnly).toString()} />
                <button className="px-3 py-2 border rounded" type="submit">
                  Set {p.isPaidOnly ? "Public" : "Paid-only"}
                </button>
              </form>
              <a className="underline" href={`/${p.slug}`} target="_blank" rel="noreferrer">Open</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function createPage(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session.user || session.user.role !== "ADMIN") redirect("/");

  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const published = formData.get("published") === "on";
  const isPaidOnly = formData.get("isPaidOnly") === "on";
  if (!title || !slug || !content) return;

  await prisma.page.create({ data: { title, slug, content, published, isPaidOnly } });
  revalidatePath("/admin/pages");
}

async function togglePublish(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session.user || session.user.role !== "ADMIN") redirect("/");
  const pageId = String(formData.get("pageId"));
  const to = String(formData.get("to")) === "true";
  await prisma.page.update({ where: { id: pageId }, data: { published: to } });
  revalidatePath("/admin/pages");
}

async function togglePaidOnly(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session.user || session.user.role !== "ADMIN") redirect("/");
  const pageId = String(formData.get("pageId"));
  const to = String(formData.get("to")) === "true";
  await prisma.page.update({ where: { id: pageId }, data: { isPaidOnly: to } });
  revalidatePath("/admin/pages");
}


