import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "./db";
import { compare } from "bcryptjs";

const key = new TextEncoder().encode(process.env.SECRET_KEY);

export async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30 sec from now")
    .sign(key);
}

export async function decrypt(input) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function signIn(credential) {
  const user = await prisma.user.findUnique({
    where: {
      email: credential.email,
    },
  });
  const status = await compare(
    credential.password.trim(),
    user.password.trim()
  );
  console.log(status);
  if (status) {
    const data = {
      id: user.id,
      email: user.email,
    };
    await login(data);
    return data;
  }
}

export async function login(data) {
  //const fetchUserInfo = useUserStore();

  const user = data;

  const expires = new Date(Date.now() + 10 * 3000);
  const session = await encrypt({ user, expires });

  // Save the session in a cookie
  cookies().set("session", session, { expires, httpOnly: true });
  //fetchUserInfo(user);
}

export async function logout() {
  // Destroy the session
  cookies().set("session", "", { expires: new Date(0) });
}

export function getSession(request) {
  const session = request.cookies.get("session")?.value;
  if (session === undefined) {
    return null;
  }
  return session;
}

export async function updateSession(request) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 10 * 3000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
