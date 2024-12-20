import { type Encrypter } from '../../data/protocols/encrypter';
import bcrypt from 'bcrypt';

export class BcryptAdapter implements Encrypter {
  private readonly salt: number;
  constructor(salt: number) {
    this.salt = salt;
  }

  async encpryt(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash;
  }
}
