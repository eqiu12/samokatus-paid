export const runtime = "nodejs";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();
  const user = session.user;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-zinc-900/60 backdrop-blur p-8 shadow-[0_1px_0_0_rgba(0,0,0,0.06),0_1px_3px_0_rgba(0,0,0,0.08)]">
        <h1 className="text-3xl font-semibold tracking-tight">
          <span className="bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-white dark:to-zinc-300">
            Samokatus Paid
          </span>
        </h1>
        <p className="text-zinc-600 dark:text-zinc-300 mt-2">Mock authentication and paid content gating</p>
      </section>

      {user ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-zinc-900/50 backdrop-blur p-4 space-y-1">
            <div>
              <span className="font-medium">User:</span> {user.username}
            </div>
            <div>
              <span className="font-medium">Role:</span> {user.role}
            </div>
            <div>
              <span className="font-medium">Paid:</span> {user.isPaid ? "yes" : "no"}
            </div>
          </div>
          <div className="flex gap-4">
            <Link href="/paid" className="underline underline-offset-4 hover:text-blue-600">
              Go to paid area
            </Link>
            {user.role === "ADMIN" && (
              <Link href="/admin" className="underline underline-offset-4 hover:text-blue-600">
                Admin dashboard
              </Link>
            )}
          </div>
          <form action={logout}>
            <button className="px-3 py-2 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800" type="submit">
              Logout
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-zinc-600 dark:text-zinc-300">Log in with mock data for testing:</p>
          <form action={mockLogin} className="space-y-3">
            <input
              name="username"
              placeholder="username"
              required
              className="border p-2 w-full rounded-lg bg-white/70 dark:bg-zinc-900/50 backdrop-blur"
            />
            <div className="flex items-center gap-2">
              <label>Role:</label>
              <select name="role" className="border p-2 rounded-lg bg-white/70 dark:bg-zinc-900/50 backdrop-blur">
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="isPaid" />
              <span>Mark as paid</span>
            </label>
            <button type="submit" className="px-3 py-2 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800">
              Login
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

async function mockLogin(formData: FormData) {
  "use server";

  const username = String(formData.get("username") || "").trim();
  const role = (formData.get("role") as string) === "ADMIN" ? "ADMIN" : "USER";
  const isPaid = formData.get("isPaid") === "on";

  if (!username) return;

  const user = await prisma.user.upsert({
    where: { username },
    update: { role, isPaid },
    create: { username, role, isPaid },
  });

  const session = await getSession();
  session.user = {
    id: user.id,
    username: user.username,
    role,
    isPaid: user.isPaid,
  };
  await session.save();
  redirect("/");
}

async function logout() {
  "use server";
  const session = await getSession();
  await session.destroy();
  redirect("/");
}
