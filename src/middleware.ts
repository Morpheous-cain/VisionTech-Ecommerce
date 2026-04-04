/**
 * Next.js Middleware — JWT session verification.
 * Protects /admin/* and /api/admin/* routes from unauthenticated access.
 */
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  // Protect admin routes
  if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth?redirect=" + encodeURIComponent(path), request.url));
    }
    // Check admin role
    const { data: customer } = await supabase
      .from("customers")
      .select("is_admin")
      .eq("user_id", user.id)
      .single();

    if (!customer?.is_admin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
