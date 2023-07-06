import { Response,Request, NextFunction } from 'express';
import { UnAuthorizedError } from './error';
import { verifyJWT } from '../utils/jwtAuth/jwt';
import { prisma } from '../utils/db/prisma';
import { AuthRequest } from '../modules/auth/auth.dto';


export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {

    const bearer = req.headers["authorization"];
    if (!bearer) {
      throw new UnAuthorizedError('No Authentication Credentials Provided');
    }

    const [, token] = bearer.split(' ');

    if (!token) {
      throw new UnAuthorizedError("No Token provided")
    }

    const payload = verifyJWT(token)
    if(!payload){
      throw new UnAuthorizedError("Invalid or Expired Token");
    }

    // check the database if user with Id exists
    const user = prisma.user.findUnique({where: {id:payload.id}});
    if(!user) {
      throw new UnAuthorizedError("Invalid or Deleted User")
    }

    // This prevents the client from using the refresh token for authentication
    req.payload = payload;
    next();
    
  };
