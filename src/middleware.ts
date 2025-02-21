import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth/next-auth";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const isLoggedIn = !!session;
  const isAdminRoute = request.nextUrl.pathname.startsWith('/dashboard') && 
    (request.nextUrl.pathname === '/dashboard' || request.nextUrl.pathname === '/dashboard/users');
  const isUserRoute = request.nextUrl.pathname.startsWith('/dashboard/u/');
  
  // If not logged in and trying to access protected routes
  if (!isLoggedIn && (isAdminRoute || isUserRoute)) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // If logged in but not admin trying to access admin routes
  if (isLoggedIn && isAdminRoute && session?.user?.role !== 'admin') {
    // Redirect non-admin users to their specific dashboard using their ID
    return NextResponse.redirect(new URL(`/dashboard/u/${session?.user?.id}`, request.url));
  }

  // If logged in but admin trying to access user routes
//   if (isLoggedIn && isUserRoute && session?.user?.role === 'admin') {
//     // Redirect admin users to admin dashboard
//     return NextResponse.redirect(new URL('/dashboard', request.url));
//   }

  // If user tries to access generic /dashboard/u/ without ID
  if (isLoggedIn && request.nextUrl.pathname === '/dashboard/u/' && session?.user?.role === 'user') {
    return NextResponse.redirect(new URL(`/dashboard/u/${session?.user?.id}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
};
