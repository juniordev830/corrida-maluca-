import { mkdirSync, copyFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'www');

rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
for (const [source, destination] of [
  ['jogo-corrida.html', 'index.html'],
  ['game.js', 'game.js'],
  ['styles.css', 'styles.css']
]) {
  copyFileSync(join(root, source), join(output, destination));
}
console.log('Versão web pronta em www/ para o Capacitor.');
