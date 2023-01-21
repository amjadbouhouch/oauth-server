import { injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import fs from 'fs';
import * as jose from 'jose';
import path from 'path';
@injectable()
export class JwtService {
  /**
   *
   */
  private JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'l3DLWwOacP7JLYZq8xRdPOZa7MeLAP3RrPEMXmC4LXW4IUfmm4uokkYYkKn4mprYmmBaAkokXkhaPXzA',
  );
  private ALG = 'HS256';
  constructor() {
    this.init();
  }
  /** */
  async init() {
    const { publicKey, privateKey } = await jose.generateKeyPair('PS256');
    // console.log(publicKey);
    // console.log(privateKey);
    // let privateKey, publicKey;
    // try {
    //   privateKey = fs.readFileSync(path.join(__dirname, 'privateKey.pem'));
    //   publicKey = fs.readFileSync(path.join(__dirname, 'publicKey.pem'));
    // } catch (error) {
    //   const response = crypto.generateKeyPairSync('rsa', {
    //     modulusLength: 2048,
    //     publicKeyEncoding: {
    //       type: 'pkcs1',
    //       format: 'pem',
    //     },
    //     privateKeyEncoding: {
    //       type: 'pkcs8',
    //       format: 'pem',
    //     },
    //   });
    //   privateKey = response.privateKey;
    //   publicKey = response.publicKey;
    //   fs.writeFileSync(path.join(__dirname, 'privateKey.pem'), privateKey);
    //   fs.writeFileSync(path.join(__dirname, 'publicKey.pem'), publicKey);
    // }

    // const privateKeyPem = fs.readFileSync(path.join(__dirname, 'privateKey.pem'));
    // const jwk = await jose.exportJWK(privateKeyPem);
    // console.log(jwk);
    // const secret = await jose.importPKCS8(privateKey, this.ALG);
    // const jwt = await new jose.SignJWT({ 'urn:example:claim': true })
    //   .setProtectedHeader({ alg: this.ALG })
    //   .setIssuedAt()
    //   .setIssuer('urn:example:issuer')
    //   .setAudience('urn:example:audience')
    //   .setExpirationTime('2h')
    //   .sign(secret);

    // console.log(jwt);
    // const jwt = await new jose.SignJWT({ 'urn:example:claim': true })
    //   .setProtectedHeader({ alg: this.ALG })
    //   .setIssuedAt()
    //   .setIssuer('urn:example:issuer')
    //   .setAudience('urn:example:audience')
    //   .setExpirationTime('2h')
    //   .sign(this.JWT_SECRET);

    // console.log(jwt);
  }
  getJwtSecret() {
    // return Buffer.from(this.JWT_SECRET, 'base64');
  }

  /**
   *
   */
  generateToken(payload, options: jwt.SignOptions = {}) {
    // const token = jwt.sign(payload, this.getJwtSecret(), { algorithm: 'HS256', ...options });
    // return token;
  }
  verify(token: string) {
    // return jwt.verify(token, this.getJwtSecret(), {}) as jwt.JwtPayload;
  }
}
