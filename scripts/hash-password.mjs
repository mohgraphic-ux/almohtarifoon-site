// Prints an ADMIN_PASSWORD_HASH for self-hosted admin sign-in. Reads the password from stdin
// so it never lands in shell history:  node scripts/hash-password.mjs
import { pbkdf2Sync, randomBytes } from 'node:crypto';
import { createInterface } from 'node:readline';
const rl = createInterface({ input: process.stdin, output: process.stderr, terminal: process.stdin.isTTY });
const ask = q => new Promise(r => { process.stderr.write(q); rl._writeToOutput = () => {}; rl.question('', a => { process.stderr.write('\n'); r(a); }); });
const b64u = b => b.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const pw = await ask('كلمة سر الإدارة (12 حرف أو أكثر): ');
rl.close();
if (pw.length < 12) { console.error('كلمة السر قصيرة'); process.exit(1); }
const salt = randomBytes(16), iterations = 100000;
console.log(`pbkdf2-sha256:${iterations}:${b64u(salt)}:${b64u(pbkdf2Sync(pw, salt, iterations, 32, 'sha256'))}`);
