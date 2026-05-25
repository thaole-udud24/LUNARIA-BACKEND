import { randomInt } from 'crypto';

export function generate4DigitCode(): string {
  // 1000 -> 9999
  return String(randomInt(1000, 10000));
}