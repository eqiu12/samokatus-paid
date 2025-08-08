export const runtime = "nodejs";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function AdminPage() {
  const session = await getSession();
  if (!session.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const [users, pages] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.page.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <h2 className="text-xl font-medium">Users</h2>
      <div className="space-y-3">
        {users.map((u) => (
          <div key={u.id} className="flex items-center justify-between border rounded p-3">
            <div className="space-y-1">
              <div className="font-medium">{u.username}</div>
              <div className="text-sm text-gray-600">Role: {u.role}</div>
              <div className="text-sm text-gray-600">Paid: {u.isPaid ? "yes" : "no"}</div>
            </div>
            <div className="flex items-center gap-2">
              <form action={togglePaid}>
                <input type="hidden" name="userId" value={u.id} />
                <input type="hidden" name="to" value={(!u.isPaid).toString()} />
                <button className="px-3 py-2 border rounded" type="submit">
                  Set {u.isPaid ? "Unpaid" : "Paid"}
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-medium pt-6">Pages</h2>
      <form action={createPage} className="flex flex-col gap-2 border rounded p-3">
        <input className="border p-2 rounded" name="title" placeholder="Title" required />
        <input className="border p-2 rounded" name="slug" placeholder="Slug (e.g. about)" required />
        <textarea className="border p-2 rounded" name="content" placeholder="HTML content" rows={6} required />
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

async function togglePaid(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const userId = String(formData.get("userId"));
  const to = String(formData.get("to")) === "true";

  await prisma.user.update({ where: { id: userId }, data: { isPaid: to } });
  revalidatePath("/admin");
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
  revalidatePath("/admin");
}

async function togglePublish(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session.user || session.user.role !== "ADMIN") redirect("/");
  const pageId = String(formData.get("pageId"));
  const to = String(formData.get("to")) === "true";
  await prisma.page.update({ where: { id: pageId }, data: { published: to } });
  revalidatePath("/admin");
}

async function togglePaidOnly(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session.user || session.user.role !== "ADMIN") redirect("/");
  const pageId = String(formData.get("pageId"));
  const to = String(formData.get("to")) === "true";
  await prisma.page.update({ where: { id: pageId }, data: { isPaidOnly: to } });
  revalidatePath("/admin");
}


