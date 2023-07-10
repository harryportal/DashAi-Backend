import { User } from "@prisma/client";
import { UserProfile } from "../../modules/auth/auth.interface";

export default function removePassword(user: User): UserProfile {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}