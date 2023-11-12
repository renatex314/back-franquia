import * as jsonwebtoken from "jsonwebtoken";
import { TokenData } from "./types";

export const formatDate = (date: Date) =>
  date
    .toISOString()
    .replace("T", " ")
    .replace(/\.[0-9]+Z/g, "");

export const generateToken = (role: 'aluno' | 'professor', email: string) => {
  const TOKEN_SECRET = process.env.TOKEN_SECRET;

  if (!TOKEN_SECRET) throw new Error("Não foi possível obter o TOKEN");

  const tokenData: TokenData = {
    role,
    userEmail: email
  };

  return jsonwebtoken.sign(tokenData, TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

export const decodeVerifyToken = (token: string) => {
  const TOKEN_SECRET = process.env.TOKEN_SECRET;

  if (!TOKEN_SECRET) throw new Error("Não foi possível obter o TOKEN");

  try {
    const tokenData = jsonwebtoken.verify(token, TOKEN_SECRET) as TokenData;

    return tokenData;
  } catch (err) {
    console.error(err);

    throw new Error("Token inválido");
  }
};
