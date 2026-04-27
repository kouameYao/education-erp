import { type NextRequest, NextResponse } from "next/server";

const LOCALES = ["fr", "en"] as const;
type Locale = (typeof LOCALES)[number];

const DEFAULT_LOCALE: Locale = "fr";
const LOCALE_COOKIE = "NEXT_LOCALE";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && (LOCALES as readonly string[]).includes(value);
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const explicitLocale = LOCALES.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (explicitLocale) {
    const stripped = pathname.slice(`/${explicitLocale}`.length) || "/";
    const url = request.nextUrl.clone();
    url.pathname = stripped;
    const response = NextResponse.redirect(url, 308);
    response.cookies.set(LOCALE_COOKIE, explicitLocale, {
      maxAge: COOKIE_MAX_AGE,
      path: "/",
      sameSite: "lax",
    });
    return response;
  }

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
