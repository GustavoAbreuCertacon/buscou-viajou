# Inventário de Assets de Marca — Buscou Viajou

Catálogo dos assets visuais oficiais da marca, divididos em três estágios do
pipeline: originais gerados pelo Nano Banana V2, otimizados em `final/` e
publicados no frontend em `public/brand/`.

Tamanhos foram medidos com Sharp (`metadata()`) sobre cada arquivo. SVGs foram
medidos via `viewBox`/`width`/`height` declarados no documento.

---

## 1. Originais — `_context/brand/NanoBananaV2/`

Saídas brutas do Gemini 2.5 Flash Image (Nano Banana). Mantidas como fonte de
verdade para reprocessamento; ainda contém a marca d'água do Gemini no canto
inferior direito.

| Arquivo                       | Tamanho   | Dimensões    | Canais | Uso (origem do pipeline)                                       |
| ----------------------------- | --------- | ------------ | ------ | -------------------------------------------------------------- |
| `v1.svg`                      | 3.177 B   | 2400×1000    | vetor  | Lockup primário (V1 full color) — fonte SVG                    |
| `v2.png`                      | 4.696.113 B | 2816×1536  | RGBA   | Lockup branco sobre navy (V2)                                  |
| `v3.png`                      | 4.934.167 B | 2816×1536  | RGBA   | Lockup branco sobre verde (V3)                                 |
| `v4.png`                      | 4.665.922 B | 2816×1536  | RGBA   | Lockup preto, fundo transparente (V4)                          |
| `v5.png`                      | 5.290.902 B | 2816×1536  | RGBA   | Lockup branco transparente (V5) — não usado: regerado de `v2`  |
| `monogram-bv-full-color.png`  | 5.169.961 B | 2048×2048  | RGBA   | Monograma BV full color                                        |
| `monogram-bv-white.png`       | 5.516.934 B | 2048×2048  | RGBA   | Monograma BV branco                                            |
| `monogram-bv-black.png`       | 4.564.239 B | 2048×2048  | RGBA   | Monograma BV preto                                             |
| `favicon-512.png`             | 3.480.572 B | 2048×2048  | RGBA   | Ícone navy com BV branco/verde, fonte dos favicons             |

Observações:
- `v5.png` existe no diretório de origem mas **não é consumido** pelo pipeline.
  O `logo-white.png` é regenerado a partir de `v2.png` via chroma-key
  (`regenerateWhiteFromNavy` em `process-logos.mjs`).
- O arquivo legado `_context/brand/buscou-viajou-logo-vectorized.svg`
  (3.900.652 B) está fora do diretório `NanoBananaV2/` e não participa do
  pipeline atual.

---

## 2. Otimizado — `_context/brand/final/`

Resultado do `process-logos.mjs`: marca d'água mascarada, redimensionado para
escalas web-friendly e comprimido com `compressionLevel: 9` + `effort: 10`
(palette habilitado nos lockups com fundo sólido).

| Arquivo                         | Tamanho   | Dimensões  | Canais | Uso                                                       | Origem                                          |
| ------------------------------- | --------- | ---------- | ------ | --------------------------------------------------------- | ----------------------------------------------- |
| `logo-full-color.svg`           | 3.177 B   | 2400×1000  | vetor  | Lockup primário (V1) — preferido em superfícies vetoriais | `NanoBananaV2/v1.svg` (cópia)                   |
| `logo-white-on-navy.png`        | 241.958 B | 917×500    | RGB    | Lockup sobre fundo navy sólido (V2)                       | `NanoBananaV2/v2.png` + máscara + resize        |
| `logo-white-on-green.png`       | 271.080 B | 917×500    | RGB    | Lockup sobre fundo verde sólido (V3)                      | `NanoBananaV2/v3.png` + máscara + resize        |
| `logo-black.png`                | 414.035 B | 917×500    | RGBA   | Lockup 1 cor preto, fundo transparente (V4)               | `NanoBananaV2/v4.png` + máscara + resize        |
| `logo-white.png`                | 32.673 B  | 1200×655   | RGBA   | Lockup branco transparente (V5)                           | `NanoBananaV2/v2.png` via chroma-key navy→alpha |
| `monogram-bv-full-color.png`    | 334.611 B | 512×512    | RGBA   | Monograma BV full color                                   | `NanoBananaV2/monogram-bv-full-color.png`       |
| `monogram-bv-white.png`         | 371.792 B | 512×512    | RGBA   | Monograma BV branco                                       | `NanoBananaV2/monogram-bv-white.png`            |
| `monogram-bv-black.png`         | 250.899 B | 512×512    | RGBA   | Monograma BV preto                                        | `NanoBananaV2/monogram-bv-black.png`            |
| `favicon-16.png`                | 825 B     | 16×16      | RGB    | Favicon legacy (browser tab)                              | `NanoBananaV2/favicon-512.png` resize           |
| `favicon-32.png`                | 1.655 B   | 32×32      | RGB    | Favicon padrão (browser tab)                              | `NanoBananaV2/favicon-512.png` resize           |
| `favicon-180.png`               | 17.628 B  | 180×180    | RGB    | Apple touch icon                                          | `NanoBananaV2/favicon-512.png` resize           |
| `favicon-512.png`               | 115.462 B | 512×512    | RGB    | PWA icon / Android home screen                            | `NanoBananaV2/favicon-512.png` resize           |

Notas técnicas do pipeline:
- `maskWatermark`: cobre 7% da largura × 10% da altura no canto inferior
  direito. Se fundo é sólido (NAVY/GREEN), aplica `blend: over`; se é
  transparente, usa `blend: dest-out` para apagar a região.
- Lockups com fundo sólido (V2, V3) saem em RGB (sem alfa) e usam `palette: true`
  para reduzir tamanho. V4/V5 mantêm alfa.
- `logo-white.png` tem altura 655px porque o resize preserva proporção do
  recorte original com watermark mascarado, não exatamente 12:5.

---

## 3. Publicado — `BuscouViajouFrontend/public/brand/`

Espelho do `final/`, exposto como assets estáticos do Next.js. Conteúdo idêntico
em bytes ao diretório `final/` na maioria dos arquivos, exceto `logo-full-color.svg`
que diverge (2.994 B no public vs 3.177 B no final).

| Arquivo                         | Tamanho   | Dimensões  | Canais | Uso                                                        |
| ------------------------------- | --------- | ---------- | ------ | ---------------------------------------------------------- |
| `logo-full-color.svg`           | 2.994 B   | 2400×1000  | vetor  | Lockup primário servido via `<Image src="/brand/...">`     |
| `logo-white-on-navy.png`        | 241.958 B | 917×500    | RGB    | Lockup sobre navy                                          |
| `logo-white-on-green.png`       | 271.080 B | 917×500    | RGB    | Lockup sobre verde                                         |
| `logo-black.png`                | 414.035 B | 917×500    | RGBA   | Lockup preto                                               |
| `logo-white.png`                | 32.673 B  | 1200×655   | RGBA   | Lockup branco transparente                                 |
| `monogram-bv-full-color.png`    | 334.611 B | 512×512    | RGBA   | Monograma BV color                                         |
| `monogram-bv-white.png`         | 371.792 B | 512×512    | RGBA   | Monograma BV branco                                        |
| `monogram-bv-black.png`         | 250.899 B | 512×512    | RGBA   | Monograma BV preto                                         |
| `favicon-16.png`                | 825 B     | 16×16      | RGB    | `<link rel="icon" sizes="16x16">`                          |
| `favicon-32.png`                | 1.655 B   | 32×32      | RGB    | `<link rel="icon" sizes="32x32">`                          |
| `favicon-180.png`               | 17.628 B  | 180×180    | RGB    | `<link rel="apple-touch-icon">`                            |
| `favicon-512.png`               | 115.462 B | 512×512    | RGB    | `manifest.json` icon / PWA                                 |

> Divergência: `logo-full-color.svg` no `public/` (2.994 B) é menor que em
> `final/` (3.177 B) e que em `NanoBananaV2/v1.svg` (3.177 B). A diferença
> sugere edição manual posterior ou sobrescrita fora do pipeline.

---

## 4. Pipeline de processamento

```
┌─────────────────────────────────────────┐
│ _context/brand/NanoBananaV2/            │
│   v1.svg                                 │
│   v2.png  v3.png  v4.png  v5.png         │ <- saídas Nano Banana V2 (com watermark)
│   monogram-bv-{full-color,white,black}   │
│   favicon-512.png                        │
└─────────────────────────────────────────┘
                  │
                  ▼
   BuscouViajouApi/scripts/process-logos.mjs
   ├── copySvg              v1.svg ─► logo-full-color.svg
   ├── processLockup        v2/v3/v4 ─► máscara watermark + resize 1200x500 fit:inside
   ├── regenWhiteFromNavy   v2 ─► chroma-key navy→alpha ─► logo-white.png 1200xN
   ├── processMonogram      monogram-* ─► máscara + resize 512x512
   └── generateFavicons     favicon-512 ─► 16/32/180/512 px
                  │
                  ▼
┌─────────────────────────────────────────┐
│ _context/brand/final/                   │
│   logo-full-color.svg                    │
│   logo-{white-on-navy,white-on-green,    │
│         black,white}.png                 │
│   monogram-bv-*.png                      │
│   favicon-{16,32,180,512}.png            │
└─────────────────────────────────────────┘
                  │
                  │  (cópia manual / sync — não automatizada no script)
                  ▼
┌─────────────────────────────────────────┐
│ BuscouViajouFrontend/public/brand/      │
│   (mesmo conjunto de arquivos)          │
└─────────────────────────────────────────┘
```

O `process-logos.mjs` grava apenas em `_context/brand/final/`. A publicação em
`BuscouViajouFrontend/public/brand/` é uma etapa manual subsequente (cópia ou
sync). Não há código que automatize esse passo no script atual.

---

## 5. Quando reprocessar

Reprocessar é necessário quando:
- Novos arquivos forem entregues em `_context/brand/NanoBananaV2/` (refinamento
  de logo via Nano Banana).
- A marca d'água do Gemini precisar ser remascarada com novo dimensionamento.
- Os parâmetros de saída (tamanho, palette, compressão) forem alterados em
  `process-logos.mjs`.

Comando único:

```bash
cd D:/Github/Buscou-Viajou/BuscouViajouApi
node scripts/process-logos.mjs
```

Saídas vão para `D:/Github/Buscou-Viajou/_context/brand/final/`. Para publicar
no frontend, copiar manualmente para
`D:/Github/Buscou-Viajou/BuscouViajouFrontend/public/brand/` (sobrescrevendo).

---

## 6. Variações disponíveis

### Lockups (5 variações)

| Código | Arquivo final              | Cores                          | Fundo               | Caso de uso                                  |
| ------ | -------------------------- | ------------------------------ | ------------------- | -------------------------------------------- |
| V1     | `logo-full-color.svg`      | B navy, V verde, check verde   | Transparente        | Primária, fundos claros (preferir SVG)       |
| V2     | `logo-white-on-navy.png`   | Tudo branco                    | Navy `#0B2A43`      | Footers, business cards, blocos navy         |
| V3     | `logo-white-on-green.png`  | Tudo branco                    | Verde `#2B9366`     | Hero blocks verdes, CTAs, social             |
| V4     | `logo-black.png`           | Tudo preto                     | Transparente        | Impressão 1 cor, fax, watermarks             |
| V5     | `logo-white.png`           | Tudo branco                    | Transparente        | Overlay sobre fotos escuras                  |

### Monogramas BV (3 variações)

| Arquivo final                | Cores                           | Fundo        | Caso de uso                       |
| ---------------------------- | ------------------------------- | ------------ | --------------------------------- |
| `monogram-bv-full-color.png` | B/V navy, check verde           | Transparente | App icon, avatar, watermark       |
| `monogram-bv-white.png`      | Tudo branco                     | Transparente | Overlay escuro                    |
| `monogram-bv-black.png`      | Tudo preto                      | Transparente | Mono print, low-fi                |

### Favicons (4 tamanhos)

| Arquivo            | Tamanho | Caso de uso                                  |
| ------------------ | ------- | -------------------------------------------- |
| `favicon-16.png`   | 16×16   | Tab do browser (legacy)                      |
| `favicon-32.png`   | 32×32   | Tab do browser (padrão moderno)              |
| `favicon-180.png`  | 180×180 | Apple touch icon (iOS home screen)           |
| `favicon-512.png`  | 512×512 | Android / PWA manifest                       |

Todos os favicons herdam o design da fonte: fundo navy `#0B2A43`, BV branco,
check verde `#2B9366`, cantos arredondados (raio 80px no original 2048×2048,
escalado proporcionalmente).
