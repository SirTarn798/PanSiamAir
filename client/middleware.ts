import { NextRequest, NextResponse } from "next/server";
import { getSession, updateSession, decrypt } from "./lib/auth";

type Session = {
  user: {
    role: string;
  };
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/login") {
    if (getSession(request)) {
      return NextResponse.redirect(new URL("/", request.url));
    } else {
      return NextResponse.next();
    }
  } else if (pathname === "/register") {
    return NextResponse.next();
  } else {
    const session = getSession(request);
    if (session) {
      const decryptedSession = (await decrypt(session)) as Session;

      if (decryptedSession.user.role === "ADMIN" && !(pathname.startsWith("/admin"))) {
        return NextResponse.redirect(new URL("/admin", request.url));
      } else if (
        decryptedSession.user.role === "CUSTOMER" &&
        ["/", "/fixing"].includes(pathname)
      ) {
        return NextResponse.next();
      } else if (
        decryptedSession.user.role === "SERVICE" &&
        !(pathname.startsWith("/service"))
      ) {
        return NextResponse.redirect(new URL("/service", request.url));
      }
    } else {
      if (pathname !== "/login") {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
  }
  // return NextResponse.redirect(new URL("/", request.url))
  //   const res = NextResponse.next();
  //   let expires = new Date(Date.now() + 10 * 1000);
  //   const session = request.cookies.get("session")?.value;
  //   if (!session) {
  //     console.log("no session")
  //   }
  //   res.cookies.set({
  //     name: "session",
  //     value: "session",
  //     httpOnly: true,
  //     expires: expires,
  //   });
  //   return res;
  // }

  // export const config = {
  //   matcher: "",
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/chat",
    "/add-ac",
    "/",
    "/fixing",
    "/admin/:path*",
    "/service/:path*",
  ],
};
