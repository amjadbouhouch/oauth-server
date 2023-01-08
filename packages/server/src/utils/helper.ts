import { customAlphabet } from 'nanoid';
import crypto from 'crypto';
export const generateId = (lengthId?: number) => {
  const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-';
  const nanoid = customAlphabet(ALPHABET, lengthId || 32);
  return nanoid();
};
export const generateUuid = () => crypto.randomUUID();
