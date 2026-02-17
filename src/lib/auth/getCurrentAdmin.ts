import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "admin_session";

export async function getCurrentAdmin() {
  // 👇 En tu versión cookies() es async
  const cookieStore = await cookies();

  const sessionId = cookieStore.get(COOKIE_NAME)?.value;
  if (!sessionId) return null;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: {
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

  if (!session) return null;

  // sesión expirada
  if (session.expiresAt.getTime() <= Date.now()) {
    return null;
  }

  return session.user;
}
