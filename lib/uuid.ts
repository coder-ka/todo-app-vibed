import { v7 as uuidv7 } from 'uuid';

export type UUIDv7 = string;

export function generateUUIDv7(): UUIDv7 {
  return uuidv7();
}