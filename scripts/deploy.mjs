// Publishes the app to GitHub Pages (branch gh-pages) from this computer.
// Usage: npm run deploy
import { execSync } from 'node:child_process';
import { rmSync, writeFileSync } from 'node:fs';

const REPO = 'https://EfrainBlanco12@github.com/EfrainBlanco12/time-travelers.git';
const OUT = 'dist/time-travelers/browser';
const run = (cmd, cwd) => execSync(cmd, { stdio: 'inherit', cwd });

run('npm run build:pages');

// GitHub Pages should serve the files as they are (no Jekyll processing).
writeFileSync(`${OUT}/.nojekyll`, '');

rmSync(`${OUT}/.git`, { recursive: true, force: true });
run('git init -q -b gh-pages', OUT);
run('git add -A', OUT);
run('git commit -q -m "Deploy Time Travelers"', OUT);
run(`git push -f ${REPO} gh-pages`, OUT);

console.log('\nPublished: https://efrainblanco12.github.io/time-travelers/ (may take ~1 minute to update)');
