import Link from "next/link";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();
  const user = session.user;

  return (
    <div className="max-w-xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Samokatus Paid – Mock Auth</h1>

      {user ? (
        <div className="space-y-4">
          <div className="rounded border p-4 space-y-1">
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
            <Link href="/paid" className="underline">
              Go to paid area
            </Link>
            {user.role === "ADMIN" && (
              <Link href="/admin" className="underline">
                Admin dashboard
              </Link>
            )}
          </div>
          <form action={logout}>
            <button className="px-3 py-2 border rounded" type="submit">
              Logout
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          <p>Log in with mock data for testing:</p>
          <form action={mockLogin} className="space-y-3">
            <input
              name="username"
              placeholder="username"
              required
              className="border p-2 w-full rounded"
            />
            <div className="flex items-center gap-2">
              <label>Role:</label>
              <select name="role" className="border p-2 rounded">
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="isPaid" />
              <span>Mark as paid</span>
            </label>
            <button type="submit" className="px-3 py-2 border rounded">
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
