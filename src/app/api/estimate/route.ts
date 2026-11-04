import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function html(title: string, message: string, back: string, status: number) {
  const body = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><body style="font-family:Inter,system-ui,sans-serif;background:#efeded;color:#292929;margin:0;padding:2.5rem"><main style="max-width:36rem"><h1>${title}</h1><p>${message}</p><p><a href="${back}">Back to the form</a></p></main></body></html>`;
  return new NextResponse(body, { status, headers: { "content-type": "text/html; charset=utf-8" } });
}

function safeBack(request: Request): string {
  const ref = request.headers.get("referer");
  if (!ref) return "/contact/#contact";
  try {
    const url = new URL(ref);
    const host = request.headers.get("host");
    if (url.host !== host) return "/contact/#contact";
    return `${url.pathname}${url.search}#contact`;
  } catch {
    return "/contact/#contact";
  }
}

function clean(value: FormDataEntryValue | null, max = 2000): string {
  return String(value || "").replace(/[\r\n]+/g, " ").trim().slice(0, max);
}

export async function POST(request: Request) {
  const back = safeBack(request);
  const form = await request.formData();
  if (clean(form.get("company"))) {
    return NextResponse.redirect(new URL("/thank-you-for-contacting-us/", request.url), 303);
  }
  const first = clean(form.get("first_name"), 80);
  const last = clean(form.get("last_name"), 80);
  const email = clean(form.get("email"), 160);
  const confirm = clean(form.get("email_confirm"), 160);
  const comments = String(form.get("comments") || "").trim().slice(0, 5000);
  const started = Number(form.get("started") || 0);
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!first || !last || !emailOk || !comments) {
    return html("Check the form", "Name, a valid email, and comments are required.", back, 400);
  }
  if (email.toLowerCase() !== confirm.toLowerCase()) {
    return html("Emails do not match", "The email and confirmation email need to be the same.", back, 400);
  }
  if (Number.isFinite(started) && started > 0 && Date.now() - started < 1500) {
    return html("Please wait a moment", "The form was submitted too quickly. Go back and try again.", back, 400);
  }

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const token = clean(form.get("cf-turnstile-response"), 2000);
    const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: turnstileSecret, response: token }),
    });
    const result = (await verify.json()) as { success?: boolean };
    if (!result.success) {
      return html("Verification failed", "The spam check did not pass. Go back and send the form again.", back, 400);
    }
  }

  const lead = {
    firstName: first,
    lastName: last,
    email,
    comments,
    receivedAt: new Date().toISOString(),
  };
  const webhook = process.env.LEAD_WEBHOOK_URL;
  const to = process.env.LEAD_TO_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL;
  const resendKey = process.env.RESEND_API_KEY;
  if (!webhook && !(to && from && resendKey)) {
    return html(
      "Lead delivery is not configured",
      "This site is not sending estimates yet. Set LEAD_TO_EMAIL, LEAD_FROM_EMAIL, and RESEND_API_KEY, or set LEAD_WEBHOOK_URL.",
      back,
      503,
    );
  }

  if (webhook) {
    const hook = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(lead),
    });
    if (!hook.ok) {
      return html("Could not send the request", "The lead webhook returned an error. Please call 303-761-1012.", back, 502);
    }
  }

  if (to && from && resendKey) {
    const sent = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${resendKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Estimate request from ${first} ${last}`,
        text: `${first} ${last}\n${email}\n\n${comments}\n`,
      }),
    });
    if (!sent.ok) {
      return html("Could not send the request", "Email delivery failed. Please call 303-761-1012.", back, 502);
    }
  }

  return NextResponse.redirect(new URL("/thank-you-for-contacting-us/", request.url), 303);
}
