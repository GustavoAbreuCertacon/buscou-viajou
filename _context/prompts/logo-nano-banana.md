# Prompt para Nano Banana — Logo Buscou Viajou

Cole o prompt MASTER abaixo na primeira interação com o Nano Banana (Gemini 2.5 Flash Image)
para estabelecer o contexto. Em seguida, peça as variações 1 a 8 individualmente, copiando os
prompts derivados na ordem. Cada variação deve ser gerada num turno separado para preservar
consistência visual.

---

## 0. PROMPT MASTER (estabelece contexto da marca)

```
You will design the official logo for "Buscou Viajou", a Brazilian Portuguese marketplace
for chartered tourism transportation (buses, mini-buses, vans). Brand positioning: the
"Trivago of charter transportation" — clean, trustworthy, optimistic, technology-forward.
The brand voice is simple, direct, and welcoming.

================================================================================
BRAND DNA
================================================================================
- Industry: travel marketplace / mobility / charter buses
- Personality: clarity, technology, movement, journey, professionalism with warmth
- Reference brands for visual quality (NOT for copying): Stripe, Linear, Airbnb,
  Trivago — minimalist geometric sans-serif lockups with strong wordmarks.
- Anti-references: avoid 3D effects, gradients, drop shadows, lens flares, generic
  AI illustration, retro vibe, hand-drawn texture, or any skeumorphism.

================================================================================
PRIMARY COLORS (must be exact hex)
================================================================================
- Navy:  #0B2A43  (trust, technology, security)
- Green: #2B9366  (movement, innovation, growth)
- Use ONLY these two brand colors plus pure white (#FFFFFF) and pure black (#000000).
  No other colors, gradients, or tints.

================================================================================
SYMBOL (BV Monogram)
================================================================================
The symbol consists of the letters "B" and "V" rendered in a clean, modern, geometric
sans-serif style (similar in spirit to Gotham, Avenir, or Poppins Bold). The two
letters sit side-by-side with no space between them.

A dynamic diagonal stroke runs across both letters from lower-left to upper-right,
visually resembling a stylized checkmark or completed-route line. This stroke is
NOT a separate overlay — it is integrated into the geometry of the letters,
either:
  (a) replacing one of the strokes of the B (e.g. the diagonal of the V intersecting
      the lower bowl of the B), OR
  (b) emerging from the bottom-left of the B and exiting through the top-right of
      the V as a continuous flowing line.

The stroke must read clearly as movement / forward travel / completion. Think
"arrow of progression". It is rendered in the GREEN color in primary versions.

The B is rendered in NAVY. The V is rendered in NAVY (with the connective
checkmark stroke in GREEN that runs through both). In primary version, the V
itself can pick up the green color while the B stays navy — but priority is
clarity, not split-color.

Symbol proportions: roughly square, fitting in a 1:1 bounding box. Stroke weight
is medium-bold but not heavy — confident but not aggressive.

================================================================================
WORDMARK
================================================================================
Text: "BuscouViajou" (one solid string, NO space, NO hyphen between the words)

Typography:
- Geometric sans-serif. Bold weight (700-800).
- Slightly tight letter spacing (-0.01em) but NOT condensed.
- Lowercase ascenders/descenders kept clean and simple.
- Capital "B" of "Buscou" and capital "V" of "Viajou" both capitalized — i.e.
  "BuscouViajou" reads as two compound CamelCase words.

Color: "Buscou" in NAVY (#0B2A43), "Viajou" in GREEN (#2B9366) in primary version.

================================================================================
DESCRIPTOR
================================================================================
Text: "Fretamento Inteligente"

Position: Below the wordmark, centered or left-aligned with it.
Size: Approximately 30% of the wordmark height.
Weight: Regular (400) or Medium (500).
Letter spacing: 0.05em — slightly tracked-out.
Color: NAVY in primary versions.

================================================================================
LOCKUP COMPOSITION
================================================================================
Horizontal lockup:
  [ BV symbol ]   [ "BuscouViajou" wordmark             ]
                  [ "Fretamento Inteligente" descriptor ]

- The symbol sits to the LEFT of the text block.
- Gap between symbol and text = approximately 0.5x the symbol height.
- Vertical center of the symbol aligns with the visual center between the
  wordmark baseline and the descriptor baseline.
- The descriptor sits flush left under the wordmark (or centered under it,
  whichever reads more balanced).

================================================================================
TECHNICAL OUTPUT REQUIREMENTS
================================================================================
- Output format: PNG with transparent background (unless variation specifies
  a colored background — then output PNG with that solid color background).
- Resolution: 2400 × 1000 pixels (12:5 aspect ratio for the horizontal lockup).
- Internal padding: minimum 100px on every side around the artwork.
- Sharp vector-quality edges. No antialiasing fringing. No JPEG artifacts.
- No watermarks, no signatures, no extra elements (no buses, no roads, no maps,
  no decorative flourishes around the lockup).
- All letters legible and consistent across versions.
```

---

## 1. VARIATION V1 — `logo-full-color.png` (PRIMARY)

```
Generate variation V1 of the Buscou Viajou logo, applying all rules from the
master brief. Specifications for V1:

- Background: TRANSPARENT (alpha channel).
- Symbol B: NAVY (#0B2A43).
- Symbol V: NAVY (#0B2A43).
- Connective checkmark stroke through B and V: GREEN (#2B9366).
- Wordmark "Buscou": NAVY (#0B2A43).
- Wordmark "Viajou": GREEN (#2B9366).
- Descriptor "Fretamento Inteligente": NAVY (#0B2A43).

This is the primary, default version of the logo. Use it whenever the background
is white or very light.

Filename: logo-full-color.png
```

---

## 2. VARIATION V2 — `logo-white-on-navy.png`

```
Generate variation V2 of the Buscou Viajou logo, applying all rules from the
master brief. Specifications for V2:

- Background: SOLID NAVY (#0B2A43), filling the entire canvas.
- Symbol (B + V + connective stroke): WHITE (#FFFFFF) entirely.
- Wordmark "BuscouViajou": WHITE entirely.
- Descriptor "Fretamento Inteligente": WHITE entirely.

Use case: dark navy marketing applications, footers, business cards on navy stock.

Filename: logo-white-on-navy.png
```

---

## 3. VARIATION V3 — `logo-white-on-green.png`

```
Generate variation V3 of the Buscou Viajou logo, applying all rules from the
master brief. Specifications for V3:

- Background: SOLID GREEN (#2B9366), filling the entire canvas.
- Symbol (B + V + connective stroke): WHITE (#FFFFFF) entirely.
- Wordmark "BuscouViajou": WHITE entirely.
- Descriptor "Fretamento Inteligente": WHITE entirely.

Use case: green hero blocks, accent CTAs, social media posts.

Filename: logo-white-on-green.png
```

---

## 4. VARIATION V4 — `logo-black.png` (1-color print)

```
Generate variation V4 of the Buscou Viajou logo, applying all rules from the
master brief. Specifications for V4:

- Background: TRANSPARENT.
- Symbol (B + V + connective stroke): BLACK (#000000) entirely.
- Wordmark "BuscouViajou": BLACK entirely.
- Descriptor "Fretamento Inteligente": BLACK entirely.

Use case: 1-color printing, fax, low-fidelity reproductions, document watermarks.

Filename: logo-black.png
```

---

## 5. VARIATION V5 — `logo-white.png`

```
Generate variation V5 of the Buscou Viajou logo, applying all rules from the
master brief. Specifications for V5:

- Background: TRANSPARENT.
- Symbol (B + V + connective stroke): WHITE (#FFFFFF) entirely.
- Wordmark "BuscouViajou": WHITE entirely.
- Descriptor "Fretamento Inteligente": WHITE entirely.

Use case: overlay on dark photos, premium dark-themed presentations.

Filename: logo-white.png
```

---

## 6. MONOGRAM — `monogram-bv-full-color.png`

```
Generate the BV monogram only (NO wordmark, NO descriptor), applying the symbol
rules from the master brief. Specifications:

- Background: TRANSPARENT.
- Symbol B: NAVY (#0B2A43).
- Symbol V: NAVY (#0B2A43).
- Connective checkmark stroke through B and V: GREEN (#2B9366).
- Output: 1200 × 1200 pixels, square, monogram centered with 100px padding.

Use case: app icon, favicon, social avatar, watermark.

Filename: monogram-bv-full-color.png
```

---

## 7. MONOGRAM — `monogram-bv-white.png`

```
Generate the BV monogram only, all-white version. Specifications:

- Background: TRANSPARENT.
- Symbol entirely WHITE (#FFFFFF).
- Output: 1200 × 1200 pixels, square, centered with 100px padding.

Filename: monogram-bv-white.png
```

---

## 8. MONOGRAM — `monogram-bv-black.png`

```
Generate the BV monogram only, all-black version. Specifications:

- Background: TRANSPARENT.
- Symbol entirely BLACK (#000000).
- Output: 1200 × 1200 pixels, square, centered with 100px padding.

Filename: monogram-bv-black.png
```

---

## 9. ÍCONE FAVICON — `favicon-512.png`

```
Generate a square favicon-style icon for Buscou Viajou. Specifications:

- Background: SOLID NAVY (#0B2A43) filling the entire canvas. Slight outer
  rounded corners (radius 80px) so it can be used as an iOS-style app icon.
- Symbol BV in WHITE (#FFFFFF) with the connective checkmark stroke in GREEN
  (#2B9366) for emphasis.
- Symbol fills approximately 60% of the icon area, centered.
- Output: 512 × 512 pixels.

Filename: favicon-512.png
```

---

## Onde colocar os arquivos no projeto

Após gerar todos, salve em:

```
BuscouViajouFrontend/public/brand/
├── logo-full-color.png       (V1 — primária)
├── logo-white-on-navy.png    (V2)
├── logo-white-on-green.png   (V3)
├── logo-black.png            (V4)
├── logo-white.png            (V5)
├── monogram-bv-full-color.png
├── monogram-bv-white.png
├── monogram-bv-black.png
└── favicon-512.png
```

E também `favicon-512.png` em:

```
BuscouViajouFrontend/src/app/icon.png   (Next.js usa convenção)
```

---

## Validação visual após gerar

Rode esse checklist com cada PNG:
- [ ] Cores hex exatas? (use color picker)
- [ ] Bordas nítidas, sem borrões / antialiasing ruim?
- [ ] Símbolo BV reconhecível em escala pequena (32px de altura)?
- [ ] Padrão bicolor preservado (Buscou navy + Viajou green) em V1?
- [ ] Background respeita as especificações (transparente vs sólido)?
- [ ] Sem texturas, gradientes, sombras parasitas?
- [ ] Wordmark legível em todas as variações?

Se alguma versão sair fora do padrão, refine pedindo: "Refine the previous output:
[descrição do problema]. Keep all other elements identical."
