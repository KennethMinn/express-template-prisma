import jwt from "jsonwebtoken";

interface Payload {
  id: number;
  email: string;
}

export const createToken = (
  payload: Payload,
  sercretKey: string,
  options: jwt.SignOptions
) => {
  const token = jwt.sign(payload, sercretKey, options);
  return token;
};
