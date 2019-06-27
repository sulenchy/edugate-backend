import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import checkToken from '../helpers/checkToken';

dotenv.config();

const secret = process.env.JWT_SECRET;

/**
 *
 * @param {integer} id - The id of the user
 * @param {integer} lifeSpan - The the lifespan of the token
 * @returns {void}
 */
export const createToken = (id, lifeSpan) => {
  if (!lifeSpan) return jwt.sign({ id }, secret);
  return jwt.sign({ id }, secret, { expiresIn: lifeSpan });
};

/**
 * This middleware protects a route from access without a token
 * sets the payload in res.locals
 * @param {object} req - express request object
 * @param {object} res - express response object
 * @param {object} next - express next to pass to next middleware
 * @returns {void}
 */
export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization || req.query.token;
  if (!token) {
    return res.status(401).json({
      status: 'unauthorized',
      message: 'please provide a token'
    });
  }
  const decoded = jwt.verify(
    token,
    secret,
    (err, info) => {
      if (err) return err;
      return info;
    }
  );
  if (!decoded.message) {
    const check = await checkToken(decoded.user_uid);
    if (check instanceof Error) return next(check);
    req.userData = decoded;
    return next();
  }
  if (decoded.message === 'jwt expired') {
    return res.status(401).json({
      status: 'unauthorized',
      message: 'token expired!'
    });
  }
  return res.status(401).json({
    status: 'unauthorized',
    message: 'invalid token!'
  });
};
