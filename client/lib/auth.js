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
    .setExpirationTime("1 day from now")
    .sign(key);
}

export async function decrypt(input) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function signIn(credential) {
  let user = null;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getUser`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        credential,
      }),
    });
    const data = await response.json();
    user = data.user.rows[0]
  } catch(error) {
    console.log(error.message)
  }
  if (user) {
    const status = await compare(
      credential.password.trim(),
      user.U_Password.trim()
    );
    if (status) {
      const data = {
        id: user.U_Id,
        name: user.U_Name,
        role: user.U_Role,
        image: user.U_Profile,
      };
      await login(data);
      return data;
    }
  } else {
    return;
  }
}

export async function login(data) {
  //const fetchUserInfo = useUserStore();

  const user = data;

  const expires = new Date(Date.now() + 10 * 8640000);
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
  parsed.expires = new Date(Date.now() + 10 * 8640000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
