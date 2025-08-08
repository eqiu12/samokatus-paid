import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export type SessionUser = {
  id: string;
  username: string;
  role: "USER" | "ADMIN";
  isPaid: boolean;
};

export type SessionData = {
  user?: SessionUser;
};

export const sessionOptions = {
  password:
    process.env.IRON_SESSION_PASSWORD ||
    "dev_password_at_least_32_characters_long_1234",
  cookieName: "samokatus_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}


