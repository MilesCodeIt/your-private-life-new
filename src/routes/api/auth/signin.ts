import { createApiHandler } from "@/utils/server/request";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { getDatabaseConnection } from "@/utils/server/database";
import { setUserToken } from "@/utils/server/cookie";
import User from "@/models/User";

export interface ApiAuthLogin {
  request: {
    username: string,
    password: string
  }

  response: {
    user: {
      id: string,
      username: string
    }
  }
}

export const POST = createApiHandler<ApiAuthLogin>(async (req, res) => {
  const body = await req.body() as ApiAuthLogin["request"];

  if (!body.username || !body.password) {
    return res.error("Identifiant ou mot de passe manquant.", { status: 400, debug: body});
  }

  await getDatabaseConnection();

  // Récupération de l'utilisateur.
  const user = await User.findOne({
    username: { $regex: new RegExp(body.username, "i") }
  });

  // Vérfiication de l'existence de l'utilisateur.
  if (!user) return res.error("L'utilisateur n'existe pas", { status: 401 });

  // Vérification du mot de passe.
  const verified = await bcrypt.compare(body.password, user.password);
  if (!verified) return res.error("Le mot de passe est incorrect", { status: 401 });

  // Payload que contiendra le token.
  const payload = {
    data: {
      id: user._id,
      username: user.username
    } as ApiAuthLogin["response"]["user"]
  };

  // Le token doit expirer après une semaine.
  const expiresIn = 60 * 60 * 24 * 7;

  // Création du token.
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn
  });

  // Sauvegarde du token dans les cookies.
  const setCookieHeader = await setUserToken(token);
  
  const headers = new Headers();
  headers.set("Set-Cookie", setCookieHeader);

  return res.success({
    user: payload.data
  }, headers);
});
