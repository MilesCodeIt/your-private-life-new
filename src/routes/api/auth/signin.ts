import { createApiHandler } from "@/utils/server/request";

import bcrypt from "bcryptjs";
import User from "@/models/User";

import { getDatabaseConnection } from "@/utils/server/database";
import { makeUserToken, setUserToken } from "@/utils/server/cookie";

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
  const body = await req.body();

  const username = (body?.username ?? "").trim();

  if (!username || !body.password) {
    return res.error("Nom d'utilisateur ou mot de passe manquant.", { status: 400, debug: {
      username
    }});
  }

  await getDatabaseConnection();

  // Récupération de l'utilisateur.
  const user = await User.findOne({
    username: { $regex: new RegExp(username, "i") }
  });

  // Vérfiication de l'existence de l'utilisateur.
  if (!user) return res.error("L'utilisateur n'existe pas", { status: 401 });

  // Vérification du mot de passe.
  const verified = await bcrypt.compare(body.password, user.password);
  if (!verified) return res.error("Le mot de passe est incorrect", { status: 401 });

  const user_data = {
    id: user._id,
    username: user.username
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
