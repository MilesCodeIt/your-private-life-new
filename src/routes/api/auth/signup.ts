import { createApiHandler } from "@/utils/server/request";

import bcrypt from "bcryptjs";
import User from "@/models/User";

import { getDatabaseConnection } from "@/utils/server/database";
import { makeUserToken, setUserToken } from "@/utils/server/cookie";

export interface ApiAuthSignup {
  request: {
    email: string,
    username: string,
    password: string,
    captcha: string
  }

  response: {
    user: {
      id: string,
      username: string
    }
  }
}

export const POST = createApiHandler<ApiAuthSignup>(async (req, res) => {
  const body = await req.body();
  
  const username = (body?.username ?? "").trim();
  const email = (body?.email ?? "").toLowerCase().trim();

  if (!username || !body.password || !email) {
    return res.error("Nom d'utilisateur, mot de passe ou e-mail manquant.", { status: 400, debug: {
      username, email
    }});
  }

  if (!body.captcha) {
    return res.error("hCaptcha vide, veuillez réessayer.", { status: 400, debug: {
      captcha: body.captcha
    }});
  }

  const captcha_response = await fetch("https://hcaptcha.com/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
    body: `response=${body.captcha}&secret=${process.env.HCAPTCHA_SECRET_KEY}`
  });

  const captcha_data = await captcha_response.json() as { success: boolean };
  if (!captcha_data.success) {
    return res.error("hCaptcha incorrect, veuillez réessayer.", { status: 403, debug: {
      captcha_request: body.captcha, captcha_response: captcha_data
    }});
  }

  await getDatabaseConnection();

  // On vérifie si l'utilisateur existe déjà.
  const userAlreadyExists = await User.findOne({
    $or: [
      { username: { $regex: new RegExp(username, "i") }},
      { email: { $regex: new RegExp(email, "i") }},
    ]
  });

  if (userAlreadyExists) {
    return res.error("Ce nom d'utilisateur et/ou e-mail est déjà utilisé.", {
      status: 401,
      debug: {
        isUsername: userAlreadyExists.username.toLowerCase().trim() === username.toLowerCase(),
        isEmail: userAlreadyExists.email.toLowerCase().trim() === email
      }
    });
  }

  const levels = new Map<string, boolean>();
  levels.set("introduction", false);

  const hashedPassword = await bcrypt.hash(body.password, 10);
  const createdUser = await User.create({
    username,
    email,
    password: hashedPassword,
    levels
  });

  const user_data = {
    id: createdUser._id,
    username: createdUser.username
  };

  // Création du token.
  const token = makeUserToken(user_data);

  // Sauvegarde du token dans les cookies.
  const setCookieHeader = await setUserToken(token);
  
  const headers = new Headers();
  headers.set("Set-Cookie", setCookieHeader);

  return res.success({
    user: user_data
  }, headers);
});
