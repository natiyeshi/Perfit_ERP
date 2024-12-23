import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if(token){
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL('/sign-in', request.url));
  } else {
      if(!token){
        return NextResponse.next()
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
  }
}



export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
