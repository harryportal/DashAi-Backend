import * as bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { InternalServerError } from "../../common/error";
import { jwtPayload } from "../../modules/auth/auth.dto";
import { User } from "@prisma/client";

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 5);
};

export const comparePassword = (password: string, hash:string) => {

  return bcrypt.compare(password, hash);
};

const secret: string | undefined = process.env.JWT_SECRET;

if(!secret) { throw new InternalServerError("JWT SECRET HAS NO VALUE!")}


export const createAcessToken = (user: User) => {

  const token = jwt.sign({ id: user.id, email: user.email,  name:user.name, activeStatus:user.activeStatus,
  type:"access"}, secret, { expiresIn: process.env.JWT_EXPIRATION_TIME });

  return token;
};

export const createRefreshToken = (user:User) =>{

  const token = jwt.sign({ id:user.id, email:user.email,type: "refresh"}, secret, {
    expiresIn: process.env.REFRESHTOKEN_EXPIRATION_TIME,
  });
  
  return token;
}

export const createVerificationToken = (email:string, id:string)=>{
  const token = jwt.sign({ id, email, type: "verify"}, secret );
  return token;
}

export const verifyJWT = (token: string): jwtPayload | null=>{
  
  try {
    const payload = jwt.verify(token, secret);
    return payload as jwtPayload;

  } catch (e) {
    return null;
  }
}

