import { type NextRequest, NextResponse } from "next/server";

// Должно совпадать с COOKIE_NAME в .env
const SESSION_COOKIE = "sessionId";

export const proxy = (req: NextRequest) => {
  const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value);
  if (hasSession) return NextResponse.next();

  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("next", req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(loginUrl.toString());
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|brand/|invite/|login$).*)"],
};
