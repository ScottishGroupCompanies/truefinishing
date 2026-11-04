import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { denverHour } from "@/lib/publish";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const hour = denverHour();
  if (hour !== 10) {
    return NextResponse.json({ ok: true, skipped: true, denverHour: hour });
  }
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
  revalidatePath("/feed");
  return NextResponse.json({ ok: true, revalidated: true, denverHour: hour });
}
