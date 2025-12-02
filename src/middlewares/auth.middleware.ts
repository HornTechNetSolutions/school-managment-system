import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayloadCustom extends jwt.JwtPayload {
  userId: string;
  role: string;
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    console.log("User in middleware:", (req as any).user);
    console.log("Roles allowed for this route:", roles);
    if (!user){
      return res.status(401).json({ message: "Unauthorized" });
    };

    if (!roles.includes(user.role)){
      return res.status(403).json({ message: "Forbidden: insufficient permissions" });
    }
    
    next();
  };
};

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  };

  const token = authHeader.split(" ")[1];

  try {
   const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as JwtPayloadCustom;

    (req as any).user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

