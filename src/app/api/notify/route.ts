import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/content";

/**
 * Relays a contact/booking submission to the studio's business inbox via
 * FormSubmit.co — a no-signup, no-API-key email relay. We still write every
 * submission to Firestore (the admin Inbox) regardless of whether this
 * succeeds; this route only adds the email copy on top of that.
 *
 * The destination address comes from `siteSettings.notifyEmail`, read
 * server-side so it isn't hardcoded into client bundles and can be changed
 * by staff via the inline-editable Contact page.
 *
 * Note: FormSubmit requires a one-time manual confirmation — the first time
 * a submission is sent to a given address, FormSubmit emails *that address*
 * asking them to click a link before it will deliver anything further.
 */
export async function POST(request: Request) {
  let body: { type?: "message" | "booking"; subject?: string; fields?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { type, subject, fields } = body;
  if (!type || !fields || typeof fields !== "object") {
    return NextResponse.json({ ok: false, error: "Missing type or fields" }, { status: 400 });
  }

  const settings = await getSiteSettings();
  const notifyEmail = settings.notifyEmail?.trim();
  if (!notifyEmail) {
    return NextResponse.json({ ok: false, error: "No notifyEmail configured" }, { status: 200 });
  }

  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(notifyEmail)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        ...fields,
        _subject: subject ?? `New ${type === "booking" ? "booking request" : "message"} — Spicy Mama website`,
        _template: "table",
        _captcha: "false",
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("FormSubmit relay failed:", res.status, text);
      return NextResponse.json({ ok: false, error: "FormSubmit relay failed" }, { status: 200 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("FormSubmit relay error:", err);
    return NextResponse.json({ ok: false, error: "FormSubmit relay error" }, { status: 200 });
  }
}
