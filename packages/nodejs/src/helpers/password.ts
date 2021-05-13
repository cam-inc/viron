import { randomBytes, pbkdf2Sync } from 'crypto';

// saltを生成する
const genSalt = (len = 128): string => randomBytes(len).toString('base64');

// saltを用いてstrをハッシュ化する
const str2hash = (
  str: string,
  salt: string,
  len = 1024, // 返されるハッシュの文字列長
  iterations = 1000 // 暗号化のストレッチング回数. 多いほど複合が難しくなる
): string => {
  return pbkdf2Sync(
    str,
    salt,
    iterations,
    Math.floor(len / 2), // 16進数にしたときにlenになる必要があるので半分にしておく
    'sha512'
  ).toString('hex');
};

export interface HashedPasswordWithSalt {
  password: string;
  salt: string;
}

// パスワードをハッシュ化する
export const genPasswordHash = (password: string): HashedPasswordWithSalt => {
  const salt = genSalt();
  return { password: str2hash(password, salt), salt };
};
