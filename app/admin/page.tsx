export const runtime = "nodejs";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import HtmlEditor from "@/components/HtmlEditor";

export default function AdminIndex() {
  redirect("/admin/pages");
}


