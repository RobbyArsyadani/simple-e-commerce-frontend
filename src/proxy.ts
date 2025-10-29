import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const token =
    req.cookies.get("token")?.value || req.headers.get("authorization");

  // List halaman yang butuh login
  const protectedPaths = ["/products"];
  const path = req.nextUrl.pathname;

  if (protectedPaths.includes(path) && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

