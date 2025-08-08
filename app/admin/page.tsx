import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function AdminPage() {
  const session = await getSession();
  if (!session.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
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


