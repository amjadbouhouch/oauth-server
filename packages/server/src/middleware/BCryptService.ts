import { injectable } from 'inversify';
import * as bcrypt from 'bcrypt';

@injectable()
export class BCryptService {
  private SLAT_ROUNDS = 15;
  constructor() {}
  private async generateSalt() {
    return bcrypt.genSalt(this.SLAT_ROUNDS);
  }
  async hash(password): Promise<string> {
    const salt = await this.generateSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
  async compare(plaintextPassword: string, hashedPassword: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(plaintextPassword, hashedPassword);
    return isMatch;
  }
}
