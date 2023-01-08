import { injectable } from 'inversify';
import jwt from 'jsonwebtoken';

@injectable()
export class JwtService {
  /**
   *
   */
  private JWT_SECRET = process.env.JWT_SECRET || 'l3DLWwOacP7JLYZq8xRdPOZa7MeLAP3RrPEMXmC4LXW4IUfmm4uokkYYkKn4mprYmmBaAkokXkhaPXzA';
  /**
   *
   */
  generateToken(payload, options: jwt.SignOptions = {}) {
    const token = jwt.sign(payload, this.JWT_SECRET, { algorithm: 'HS256', ...options });
    return token;
  }
  verify(token: string) {
    return jwt.verify(token, this.JWT_SECRET) as jwt.JwtPayload;
  }
  get jwtSecret() {
    return this.JWT_SECRET;
  }
}
