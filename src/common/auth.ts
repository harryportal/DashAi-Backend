import { Response, NextFunction } from 'express';
import { AuthRequest }from '../modules/auth/auth.dto';
import { UnAuthorizedError } from './error';
import { verifyJWT } from '../utils/jwtAuth/jwt';


export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {

    const bearer = req.headers.authorization;
    if (!bearer) {
      throw new UnAuthorizedError('No Authentication Credentials Provided');
    }

    const [, token] = bearer.split(' ');

    if (!token) {
      throw new UnAuthorizedError("No Credentials provided")
    }

    const payload = verifyJWT(token)
    if(!payload){
      throw new UnAuthorizedError("Invalid Credentials provided");
    }


    // This prevents the client from using the refresh token for authentication
    req.user = payload;
    next();
    
  };
