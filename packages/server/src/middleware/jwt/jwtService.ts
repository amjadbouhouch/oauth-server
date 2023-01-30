import { User, Client } from '@oauth/db-client';
import { injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import { generateUuid } from '../../utils/helper';
@injectable()
export class JwtService {
  /**
   *
   */
  private JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'l3DLWwOacP7JLYZq8xRdPOZa7MeLAP3RrPEMXmC4LXW4IUfmm4uokkYYkKn4mprYmmBaAkokXkhaPXzA',
  );

  getJwtSecret() {
    //@ts-ignore
    return Buffer.from(this.JWT_SECRET, 'base64');
  }
  /** */
  getToken(user: User, client: Client) {
    const now = new Date();
    const afterOneDay = now.setDate(now.getDate() + 1);
    const id = generateUuid();

    const payload = {
      // (Expiration Time) is the time at which the token will expire and will no longer be valid.
      exp: afterOneDay,
      //(Issued At Time) is the time at which the token was issued.
      iat: now.getTime(),
      //  (JWT ID) is a unique identifier for the token.
      jti: id,
      // (Issuer) is the entity that issued the token.
      iss: 'localhost:5000',
      //(Audience) is the intended audience for the token, typically the entity that will consume the token.
      aud: client.id,
      // (Subject) is the subject of the token, typically the user for whom the token was issued.
      sub: user.id,
      //
      client_id: client.clientId,
      azp: client.clientId,
      type: 'Bearer',
    };
    return {
      accessToken: this.generateToken(payload),
      id,
      tokenExpiresAt: afterOneDay,
    };
  }
  /**
   *
   */
  generateToken(payload, options: jwt.SignOptions = {}) {
    const token = jwt.sign(payload, this.getJwtSecret(), { algorithm: 'HS256', ...options });
    return token;
  }
  verify(token: string) {
    return jwt.verify(token, this.getJwtSecret(), {}) as jwt.JwtPayload;
  }
}
