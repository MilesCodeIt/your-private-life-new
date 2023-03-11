import { createApiHandler } from "@/utils/server/request";
import jwt from "jsonwebtoken";

import { getUserToken } from "@/utils/server/cookie";

export const GET = createApiHandler(async (req, res) => {
  const token = await getUserToken(req.headers.get("Cookie") as string);
  if (!token) return res.error("Utilisateur déconnecté.", {
    status: 403
  });

  const payload = jwt.verify(token, process.env.JWT_SECRET as string);
  if (!payload) {
    return res.error("Token de connexion invalide, déconnecté.", {
      status: 403
    });
  }

  return res.success({
    user: payload.data
  });
})