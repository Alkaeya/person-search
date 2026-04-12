import { auth } from "@/app/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const session = await auth()

  const isAuthPage = request.nextUrl.pathname.startsWith("/auth")

  if (isAuthPage) {
    // Allow access to auth pages without session
    return NextResponse.next()
  }

  // For now, allow all non-auth pages to be accessed
  // The app-level components will handle authentication checks for CRUD operations
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
