import { NextRequest, NextResponse } from "next/server";
import { getSession, updateSession } from "./lib/auth";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/login") {
    if (getSession(request)) {
      return NextResponse.redirect(new URL("/", request.url));
    } else {
      return NextResponse.next();
    }
  } else if (request.nextUrl.pathname === "/register") {
    return NextResponse.next();
  } else {
    if (getSession(request)) {
      return await updateSession(request)
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
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
  matcher: ['/login', '/register', "/chat", "/add-ac", "/"],
}
