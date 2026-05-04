import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import path from 'path';

const assetsDir = './src/assets';

const targets = [
  { file: 'documentary-poster.png', quality: 75 },
  { file: 'mine_tunnel_bg.png', quality: 70 },
  { file: 'ufba_logo.png', quality: 80 },
  { file: 'crea_logo.png', quality: 80 },
  { file: 'abem_logo.png', quality: 80 },
  { file: 'jmc_logo.png', quality: 80 },
];

for (const t of targets) {
  const src = path.join(assetsDir, t.file);
  const dest = path.join(assetsDir, t.file.replace('.png', '.webp'));
  try {
    const info = await stat(src);
    const before = (info.size / 1024).toFixed(0);
    await sharp(src).webp({ quality: t.quality }).toFile(dest);
    const after = ((await stat(dest)).size / 1024).toFixed(0);
    console.log(`✓ ${t.file}: ${before}KB → ${after}KB (webp)`);
  } catch (e) {
    console.log(`✗ ${t.file}: ${e.message}`);
  }
}

console.log('\nDone! Now update imports in your code.');
