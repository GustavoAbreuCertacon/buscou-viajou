/**
 * Processa os logos do Nano Banana V2:
 *   1. Resize pra tamanhos web-friendly
 *   2. Remove watermark do Gemini (canto inferior direito)
 *   3. Regera v5 (white logo) a partir do v4 (black logo) via negate
 *   4. Cria variantes de favicon (16, 32, 180, 512)
 *   5. Compressão lossless agressiva (palette quando aplicável)
 *
 * Uso: node scripts/process-logos.mjs
 */

import sharp from 'sharp';
import path from 'node:path';
import fs from 'node:fs';

const SRC = 'D:/Github/Buscou-Viajou/_context/brand/NanoBananaV2';
const OUT = 'D:/Github/Buscou-Viajou/_context/brand/final';

fs.mkdirSync(OUT, { recursive: true });

const NAVY = { r: 0x0b, g: 0x2a, b: 0x43, alpha: 1 };
const GREEN = { r: 0x2b, g: 0x93, b: 0x66, alpha: 1 };
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

/**
 * Cobre o canto inferior direito da imagem com um retângulo da cor de fundo
 * pra esconder o watermark do Gemini.
 */
async function maskWatermark(buffer, watermarkColor) {
  const meta = await sharp(buffer).metadata();
  const wmW = Math.floor(meta.width * 0.07);
  const wmH = Math.floor(meta.height * 0.1);

  const overlay = await sharp({
    create: {
      width: wmW,
      height: wmH,
      channels: 4,
      background: watermarkColor,
    },
  })
    .png()
    .toBuffer();

  return sharp(buffer)
    .composite([
      {
        input: overlay,
        left: meta.width - wmW,
        top: meta.height - wmH,
        blend: watermarkColor.alpha === 0 ? 'dest-out' : 'over',
      },
    ])
    .toBuffer();
}

async function processLockup({ src, dest, width, height, bgColor, palette = false }) {
  const inputBuffer = fs.readFileSync(path.join(SRC, src));
  const masked = await maskWatermark(inputBuffer, bgColor);

  await sharp(masked)
    .resize(width, height, {
      fit: 'inside',
      background: bgColor,
      withoutEnlargement: true,
    })
    .png({ compressionLevel: 9, palette, effort: 10 })
    .toFile(path.join(OUT, dest));

  const stat = fs.statSync(path.join(OUT, dest));
  console.log(`  ${dest.padEnd(36)}  ${(stat.size / 1024).toFixed(1).padStart(7)} KB`);
}

async function processMonogram({ src, dest, size, bgColor, palette = false }) {
  const inputBuffer = fs.readFileSync(path.join(SRC, src));
  const masked = await maskWatermark(inputBuffer, bgColor);

  await sharp(masked)
    .resize(size, size, {
      fit: 'inside',
      background: bgColor,
      withoutEnlargement: true,
    })
    .png({ compressionLevel: 9, palette, effort: 10 })
    .toFile(path.join(OUT, dest));

  const stat = fs.statSync(path.join(OUT, dest));
  console.log(`  ${dest.padEnd(36)}  ${(stat.size / 1024).toFixed(1).padStart(7)} KB`);
}

/**
 * Regera v5 (branco transparente) a partir de v2 (white-on-navy)
 * fazendo chroma-key: pixels navy (com tolerância) viram transparentes.
 * Bordas semi-navy (antialiasing) recebem alpha proporcional pra preservar
 * suavidade do contorno.
 */
async function regenerateWhiteFromNavy() {
  const inputBuffer = fs.readFileSync(path.join(SRC, 'v2.png'));
  const masked = await maskWatermark(inputBuffer, NAVY);

  const { data, info } = await sharp(masked)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.from(data);
  const navyR = NAVY.r, navyG = NAVY.g, navyB = NAVY.b;

  // Distância máxima do navy pra considerar background. Pixels além disso são "logo".
  // Pixels intermediários recebem alpha proporcional (suaviza antialiasing).
  const maxDist = 180;

  for (let i = 0; i < out.length; i += 4) {
    const r = out[i], g = out[i + 1], b = out[i + 2];
    const dist = Math.sqrt(
      (r - navyR) ** 2 + (g - navyG) ** 2 + (b - navyB) ** 2,
    );
    if (dist < 20) {
      // Background puro
      out[i + 3] = 0;
    } else if (dist < maxDist) {
      // Borda — alpha proporcional, e força white nos canais RGB
      const t = (dist - 20) / (maxDist - 20);
      out[i + 3] = Math.round(255 * t);
      out[i] = 255;
      out[i + 1] = 255;
      out[i + 2] = 255;
    } else {
      // Logo (já era branco) — força white pra eliminar resíduo de tinta
      out[i] = 255;
      out[i + 1] = 255;
      out[i + 2] = 255;
    }
  }

  await sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .resize(1200, null, { fit: 'inside', withoutEnlargement: true })
    .png({ compressionLevel: 9, effort: 10 })
    .toFile(path.join(OUT, 'logo-white.png'));

  const stat = fs.statSync(path.join(OUT, 'logo-white.png'));
  console.log(`  logo-white.png (chroma-key v2)         ${(stat.size / 1024).toFixed(1).padStart(7)} KB`);
}

async function generateFavicons() {
  const inputBuffer = fs.readFileSync(path.join(SRC, 'favicon-512.png'));
  // Watermark do favicon está em navy, mascaramos
  const masked = await maskWatermark(inputBuffer, NAVY);

  for (const size of [16, 32, 180, 512]) {
    await sharp(masked)
      .resize(size, size, { fit: 'inside' })
      .png({ compressionLevel: 9, effort: 10 })
      .toFile(path.join(OUT, `favicon-${size}.png`));
    const stat = fs.statSync(path.join(OUT, `favicon-${size}.png`));
    console.log(`  favicon-${size}.png${' '.repeat(28 - String(size).length)} ${(stat.size / 1024).toFixed(1).padStart(7)} KB`);
  }
}

function copySvg() {
  fs.copyFileSync(
    path.join(SRC, 'v1.svg'),
    path.join(OUT, 'logo-full-color.svg'),
  );
  const stat = fs.statSync(path.join(OUT, 'logo-full-color.svg'));
  console.log(`  logo-full-color.svg                    ${(stat.size / 1024).toFixed(1).padStart(7)} KB`);
}

async function main() {
  console.log('Processando logos do Nano Banana V2 -> final/\n');

  console.log('[svg]');
  copySvg();

  console.log('\n[lockups]');
  // V2: white-on-navy. Bg navy sólido. Width 1200, fica balanceado.
  await processLockup({
    src: 'v2.png',
    dest: 'logo-white-on-navy.png',
    width: 1200,
    height: 500,
    bgColor: NAVY,
    palette: true,
  });
  await processLockup({
    src: 'v3.png',
    dest: 'logo-white-on-green.png',
    width: 1200,
    height: 500,
    bgColor: GREEN,
    palette: true,
  });
  // V4: black on transparent. Sem palette pra preservar antialiasing das bordas.
  await processLockup({
    src: 'v4.png',
    dest: 'logo-black.png',
    width: 1200,
    height: 500,
    bgColor: TRANSPARENT,
    palette: false,
  });
  // V5: regenerado do V2 via chroma-key (navy → transparente).
  await regenerateWhiteFromNavy();

  console.log('\n[monogramas]');
  await processMonogram({
    src: 'monogram-bv-full-color.png',
    dest: 'monogram-bv-full-color.png',
    size: 512,
    bgColor: TRANSPARENT,
  });
  await processMonogram({
    src: 'monogram-bv-white.png',
    dest: 'monogram-bv-white.png',
    size: 512,
    bgColor: TRANSPARENT,
  });
  await processMonogram({
    src: 'monogram-bv-black.png',
    dest: 'monogram-bv-black.png',
    size: 512,
    bgColor: TRANSPARENT,
  });

  console.log('\n[favicons]');
  await generateFavicons();

  console.log('\nProcessamento concluido. Outputs em:');
  console.log(`  ${OUT}`);
}

main().catch((e) => {
  console.error('Erro:', e);
  process.exit(1);
});
