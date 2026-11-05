const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function EstimateForm({ heading = "Request an estimate" }: { heading?: string }) {
  return (
    <section id="contact" className="scroll-mt-24 border-t-8 border-amber bg-ink text-white">
      <div className="mx-auto grid max-w-[1120px] gap-8 px-4 py-14 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-semibold text-white">{heading}</h2>
          <p className="mt-3 max-w-md text-grey">
            Send your name, email, and a short note about the floor. A person at True Finishing follows up. Call{" "}
            <a href="tel:303-761-1012" className="text-amber">
              303-761-1012
            </a>{" "}
            if you would rather talk it through.
          </p>
          <p className="mt-6 text-sm text-grey">
            True Finishing, LLC
            <br />
            2290 S Lipan St
            <br />
            Denver, CO 80223
          </p>
        </div>
        <form action="/api/estimate" method="post" className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm">
              First name
              <input name="first_name" required autoComplete="given-name" className="field" />
            </label>
            <label className="grid gap-1 text-sm">
              Last name
              <input name="last_name" required autoComplete="family-name" className="field" />
            </label>
          </div>
          <label className="grid gap-1 text-sm">
            Email
            <input name="email" type="email" required autoComplete="email" className="field" />
          </label>
          <label className="grid gap-1 text-sm">
            Confirm email
            <input name="email_confirm" type="email" required autoComplete="email" className="field" />
          </label>
          <label className="grid gap-1 text-sm">
            Comments
            <textarea name="comments" required rows={5} className="field" placeholder="Space, current floor, and what you want it to do." />
          </label>
          <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
            <label>
              Company
              <input name="company" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <input type="hidden" name="started" value={String(Date.now())} />
          {siteKey ? (
            <>
              <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
              <div className="cf-turnstile" data-sitekey={siteKey} />
            </>
          ) : null}
          <button type="submit" className="btn justify-self-start">
            Send Request
          </button>
        </form>
      </div>
    </section>
  );
}
