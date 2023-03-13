import { createCookieSessionStorage } from 'solid-start';
import jwt from "jsonwebtoken";
 
const storage = createCookieSessionStorage({
  cookie: {
    name: "session",
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true
  }
});

export const getUserToken = async (cookies: string) => {
  const session = await storage.getSession(cookies);
  const token = session.get("token");
  return token as string | undefined;
};

export const setUserToken = async (token: string, cookies?: string) => {
  const session = await storage.getSession(cookies);
  session.set("token", token);

  /** Returns value for "Set-Cookie" header. */
  return await storage.commitSession(session);
}

export const makeUserToken = (user: {
  id: string,
  username: string
}) => {
  // Payload que contiendra le token.
  const payload = {
    data: user
  };

  // Le token doit expirer après une semaine.
  const expiresIn = 60 * 60 * 24 * 7;

  // Création du token.
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn
  });

  return token;
};
