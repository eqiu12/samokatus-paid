export const runtime = "nodejs";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session.user || session.user.role !== "ADMIN") redirect("/");

  return (
    <div className="grid grid-cols-[220px_1fr] gap-6">
      <aside className="h-full">
        <div className="sticky top-20 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/50 backdrop-blur p-4">
          <div className="text-sm font-semibold mb-3">Admin</div>
          <nav className="flex flex-col gap-2 text-sm">
            <Link className="hover:underline underline-offset-4" href="/admin/pages">Pages</Link>
            <Link className="hover:underline underline-offset-4" href="/admin/users">Users</Link>
          </nav>
        </div>
      </aside>
      <section>{children}</section>
    </div>
  );
}


