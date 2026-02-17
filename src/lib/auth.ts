import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

type CurrentAdmin =
  | {
      id: string;
      email: string;
      createdAt: Date;
    }
  | null;

function getCookieName(): string {
  return process.env.SESSION_COOKIE_NAME?.trim() || "admin_session";
}

export async function getCurrentAdmin(): Promise<CurrentAdmin> {
  const cookieStore = await cookies();
  const cookieName = getCookieName();

  const sessionToken = cookieStore.get(cookieName)?.value;
  if (!sessionToken) return null;

  const session = await prisma.session.findUnique({
    where: { id: sessionToken },
    select: {
      id: true,
      expiresAt: true,
      user: {
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      },
    },
  });

  if (!session) {
    return null; // ❗ NO borrar cookie aquí
  }

  if (session.expiresAt < new Date()) {
    return null; // ❗ NO borrar cookie aquí
  }

  return session.user;
}
