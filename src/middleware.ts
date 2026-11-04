import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("page_id");
  if (id === "1530") {
    return new NextResponse("This page has been removed.", {
      status: 410,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
  if (id === "353") {
    const url = request.nextUrl.clone();
    url.pathname = "/about/";
    url.search = "";
    return NextResponse.redirect(url, 301);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|images|brand|favicon.ico).*)"],
};
