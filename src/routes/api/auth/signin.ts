import { createApiHandler } from "@/utils/server/request";

import bcrypt from "bcryptjs";
import User from "@/models/User";

import { getDatabaseConnection } from "@/utils/server/database";
import { makeUserToken, setUserToken } from "@/utils/server/cookie";

export interface ApiAuthSignin {
  request: {
    /** Can be username or e-mail. */
    uid: string,
    password: string
  }

  response: {
    user: {
      id: string,
      username: string
    }
  }
}

export const POST = createApiHandler<ApiAuthSignin>(async (req, res) => {
  const body = await req.body() as ApiAuthSignin["request"];

  const uid = (body?.uid ?? "").trim();

  if (!uid || !body.password) {
    return res.error("Identifiant ou mot de passe manquant.", { status: 400, debug: {
      uid
    }});
  }

  await getDatabaseConnection();

  // Récupération de l'utilisateur.
  const user = await User.findOne({
    $or: [
      { username: { $regex: new RegExp(uid, "i") } },
      { email: { $regex: new RegExp(uid, "i") } }
    ]
  });

  // Vérfiication de l'existence de l'utilisateur.
  if (!user) return res.error("L'utilisateur n'existe pas", { status: 401 });

  // Vérification du mot de passe.
  const verified = await bcrypt.compare(body.password, user.password);
  if (!verified) return res.error("Le mot de passe est incorrect", { status: 401 });

  const user_data = {
    id: user._id.toString(),
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
