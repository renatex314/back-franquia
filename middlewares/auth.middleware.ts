import { RequestHandler } from "express"
import * as jsonwebtoken from 'jsonwebtoken';

const authenticateUser: RequestHandler = (req, res, next) => {
  const TOKEN_SECRET = process.env.TOKEN_SECRET || '';
  const bearerToken = req.headers?.authorization?.trim();

  if (bearerToken !== '') {
    const jwtToken = bearerToken?.split(' ')?.[1].trim() || '';

    jsonwebtoken.verify(jwtToken, TOKEN_SECRET, (err) => {
      if (err) return res.status(401).send('Token inválido');

      return next();
    });
  } else {
    return res.status(400).send('Não autorizado');
  }
}

export default {
  authenticateUser
}