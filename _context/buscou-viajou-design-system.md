# Design System — Buscou Viajou

> **Fonte única:** este documento foi derivado 100% a partir do *Manual da Marca — Buscou Viajou v1* (PDF, 12 páginas, Canva).
> Tudo que NÃO está explicitamente no manual e foi inferido para viabilizar o uso em produto digital está **sinalizado com `[INFERÊNCIA]`**.
> Itens que exigem validação do time de marca estão consolidados na última seção.

---

## 0. Resumo Executivo

**Buscou Viajou** é uma marca de **fretamento inteligente** posicionada como plataforma digital no mercado de turismo e mobilidade. O nome comunica a jornada completa do usuário em três movimentos: **Buscou → Encontrou → Viajou** — transmitindo agilidade, facilidade e conversão rápida.

A marca se apoia em três pilares de valor: **Simplicidade, Inovação e Conexão**. Sua voz é **simples, confiável e direta**, e sua comunicação evita termos complicados, priorizando mensagens curtas e acolhedoras.

Visualmente, a identidade é construída a partir de:
- **Monograma BV** com traço dinâmico (tipo checkmark) que sugere movimento e jornada.
- **Wordmark** bicolor: `Buscou` em navy + `Viajou` em verde, com descritor `Fretamento Inteligente` abaixo.
- **Paleta dual** de duas cores primárias: **Navy `#0B2A43`** (confiança, tecnologia, segurança) e **Verde `#2B9366`** (movimento, inovação, crescimento).
- **Tipografia**: **Gotham** para títulos e **Hind** para corpo (ver [Ambiguidade #1](#pontos-que-exigem-validação) — o specimen do manual também mostra Poppins).
- **Linguagem visual de fundo**: papel quadriculado (grid/blueprint) acinzentado claro, reforçando o território de "planejamento" e "rota".
- **Elemento decorativo recorrente**: molduras em cantos com finas linhas navy, sugerindo rota traçada a mão.

Este design system traduz esses fundamentos em **design tokens**, **regras de uso** e **componentes base** prontos para implementação em produto digital (React/Tailwind/CSS). Onde o manual é omisso (escalas de espaçamento, raios, sombras, estados de componentes), as decisões foram inferidas preservando a essência da marca e estão marcadas com `[INFERÊNCIA]`.

---

## 1. Fundamentos da Marca

### 1.1 Propósito e Posicionamento

> Fonte: página 2 do manual (*Análise Estratégica da Marca*).

A escolha do nome **Buscou Viajou** foi pensada estrategicamente para construir uma **plataforma digital escalável no mercado de turismo e mobilidade**.

Duas direções estratégicas foram consideradas:

1. **Plataforma escalável nacional** — solução digital que conecta pessoas a viagens, transporte e experiências em todo o país.
2. **Plataforma emocional de turismo local** — marca voltada para passeios regionais e experiências mais leves.

O nome **Buscou Viajou** vence por comunicar de forma clara a **jornada do usuário**: *buscar, encontrar e viajar*. Essa estrutura simples transmite **agilidade, facilidade e conversão rápida** — atributos essenciais para plataformas digitais e marketplaces.

**Assinatura de jornada:**

```
Buscou → Encontrou → Viajou
```

Essa assinatura é exibida em **verde `#2B9366`** e pode ser usada como fechamento de peças de comunicação.

### 1.2 Valores da Marca

> Fonte: página 3 (*Principais Valores*).

Três pilares, com destaque visual equivalente:

| Valor | Descrição oficial |
|---|---|
| **Simplicidade** | Acreditamos que viajar deve ser fácil. Criamos soluções simples e intuitivas para que as pessoas encontrem, comparem e reservem viagens sem complicação. |
| **Inovação** | Buscamos constantemente novas tecnologias e formas de melhorar a experiência de viagem, tornando o processo de busca e contratação cada vez mais rápido e inteligente. |
| **Conexão** | Conectamos pessoas a destinos, experiências e oportunidades de viagem, criando uma rede de mobilidade acessível e eficiente. |

**Tratamento visual dos valores (página 3):**
- `Simplicidade` → card com **borda verde**, fundo branco, texto navy.
- `Inovação` → card com **fundo verde sólido**, texto branco, com **leve rotação** (≈ -6°) para criar destaque e movimento.
- `Conexão` → card com **fundo navy sólido**, texto branco.

Essa tríade de tratamentos (outline / green-fill / navy-fill) forma um sistema de **tipos de cards de destaque** reutilizável.

### 1.3 Tom & Voz

> Fonte: página 4 (*Tom & Voz*).

**Título posicional:** *Simples, confiável e direto.*

- Falamos de forma **clara, acessível e objetiva**.
- Evitamos termos complicados.
- Priorizamos mensagens simples que ajudem o usuário a encontrar a próxima viagem com **rapidez e confiança**.
- A linguagem transmite **praticidade, tecnologia e facilidade**, refletindo a experiência da plataforma: *buscar, comparar e viajar sem complicação*.
- A conversa com o público é **próxima e otimista**, mostrando que viajar pode ser *simples, rápido e ao alcance de todos*.

### 1.4 Diretrizes de Comunicação

> Fonte: página 5 (*Diretrizes de Comunicação*).

1. **Clareza e Simplicidade** — Comunicação direta, fácil de entender e sem termos desnecessários.
2. **Tom Acolhedor** — Linguagem próxima, acessível e que transmite confiança ao usuário.
3. **Consistência** — Mesmo estilo de comunicação em todos os canais da marca.
4. **Profissionalismo Flexível** — Transmitimos segurança e credibilidade em cada interação.

**Checklist para escrever em nome da marca:**

- [ ] A frase é compreensível no primeiro contato?
- [ ] Foi removido qualquer jargão técnico desnecessário?
- [ ] Transmite confiança sem ser rígido?
- [ ] Soa como a mesma voz usada nos outros canais?
- [ ] É otimista e convida à ação?

---

## 2. Logotipo

> Fonte: páginas 6 e 7.

### 2.1 Composição

O logotipo oficial combina três elementos:

1. **Monograma "BV"** — as iniciais da marca, desenhadas com um **traço dinâmico em diagonal** (visual de checkmark/tick) que atravessa as duas letras. Representa **movimento, jornada e conexão entre origem e destino**.
2. **Wordmark** — `Buscou` em navy + `Viajou` em verde, fundidos sem espaço (`BuscouViajou`).
3. **Descritor** — `Fretamento Inteligente`, em navy, peso regular, logo abaixo do wordmark.

### 2.2 Leitura Simbólica (oficial)

- A **tipografia do wordmark** é moderna e limpa, transmitindo **clareza, tecnologia e facilidade de uso**.
- O **"BV"** representa as iniciais e transmite **movimento, jornada e conexão entre origem e destino**.
- A **composição símbolo + nome** reforça **reconhecimento, simplicidade e identidade visual**.

### 2.3 Versões Oficiais

> Fonte: página 7 (*Logotipo — variações*).

O manual apresenta **5 variações** para garantir **legibilidade e consistência em diferentes fundos e aplicações**:

| # | Fundo | Símbolo | Wordmark | Uso |
|---|---|---|---|---|
| V1 | Branco | Navy + verde (original) | Navy + verde | Versão primária, sempre que possível |
| V2 | Navy `#0B2A43` | Branco | Branco | Aplicações escuras/marketing em navy |
| V3 | Verde `#2B9366` | Branco | Branco | Aplicações em background verde |
| V4 | Branco | Preto | Preto | Impressão em 1 tinta / blackwhite |
| V5 | Preto | Branco | Branco | Alto contraste, aplicações premium/escuras |

### 2.4 Nomenclatura de arquivos `[INFERÊNCIA]`

Para organização no produto:

```
/assets/brand/
├── logo-full-color.svg          # V1 — primária
├── logo-white-on-navy.svg       # V2
├── logo-white-on-green.svg      # V3
├── logo-black.svg               # V4
├── logo-white.svg               # V5
├── monogram-bv-full-color.svg   # Apenas o "BV"
├── monogram-bv-white.svg
└── monogram-bv-black.svg
```

### 2.5 Usos incorretos `[INFERÊNCIA]`

O manual não lista explicitamente usos proibidos. Com base nas boas práticas e na intenção declarada de *clareza e legibilidade*, recomenda-se **NÃO**:

- Distorcer, esticar ou comprimir o logotipo.
- Aplicar gradientes que não sejam os dois tons oficiais.
- Rotacionar o logotipo (exceto em mockups decorativos tipo o card "Inovação" — que rotaciona o *container*, não o logo).
- Aplicar sombra, contorno, bevel ou efeitos 3D.
- Usar sobre fundos fotográficos sem área de proteção/filtro de contraste suficiente.
- Alterar as cores oficiais.
- Trocar a ordem ou espaçamento entre símbolo, wordmark e descritor.
- Usar o descritor `Fretamento Inteligente` isoladamente.

---

## 3. Design Tokens

Os tokens abaixo são a **fonte de verdade única** para implementação. Use-os em CSS, Tailwind, React ou qualquer ferramenta de design.

### 3.1 Tokens em JSON (padrão *Design Tokens Community Group*)

```json
{
  "color": {
    "brand": {
      "navy":  { "value": "#0B2A43", "type": "color", "description": "Primária. Confiança, tecnologia, segurança." },
      "green": { "value": "#2B9366", "type": "color", "description": "Primária. Movimento, inovação, crescimento." }
    },
    "neutral": {
      "white":      { "value": "#FFFFFF" },
      "black":      { "value": "#000000" },
      "background": { "value": "#F1F5F6", "description": "[INFERÊNCIA] Cinza frio usado como background das pranchas." },
      "grid-line":  { "value": "#E1E7EA", "description": "[INFERÊNCIA] Linhas do grid/blueprint." }
    },
    "text": {
      "primary":   { "value": "{color.brand.navy}" },
      "secondary": { "value": "{color.brand.navy}", "alpha": 0.72, "description": "[INFERÊNCIA]" },
      "accent":    { "value": "{color.brand.green}" },
      "inverse":   { "value": "{color.neutral.white}" }
    }
  },
  "font": {
    "family": {
      "heading": { "value": "Gotham, 'Helvetica Neue', Arial, sans-serif" },
      "body":    { "value": "Hind, Poppins, 'Helvetica Neue', Arial, sans-serif", "description": "Ver ambiguidade #1" }
    },
    "weight": {
      "regular":  { "value": 400 },
      "medium":   { "value": 500, "description": "[INFERÊNCIA]" },
      "semibold": { "value": 600, "description": "[INFERÊNCIA]" },
      "bold":     { "value": 700 },
      "black":    { "value": 900, "description": "[INFERÊNCIA] Usado nos títulos principais." }
    },
    "size": {
      "display": { "value": "56px", "description": "[INFERÊNCIA] Títulos de abertura ('Manual da Marca')." },
      "h1":      { "value": "40px", "description": "[INFERÊNCIA]" },
      "h2":      { "value": "32px", "description": "[INFERÊNCIA]" },
      "h3":      { "value": "24px", "description": "[INFERÊNCIA]" },
      "h4":      { "value": "20px", "description": "[INFERÊNCIA]" },
      "body-lg": { "value": "18px", "description": "[INFERÊNCIA]" },
      "body":    { "value": "16px", "description": "[INFERÊNCIA] Tamanho base." },
      "body-sm": { "value": "14px", "description": "[INFERÊNCIA]" },
      "caption": { "value": "12px", "description": "[INFERÊNCIA] Rodapé 'Manual da Marca • Buscou Viajou'." }
    },
    "lineHeight": {
      "tight":   { "value": 1.1,  "description": "[INFERÊNCIA] Títulos display." },
      "snug":    { "value": 1.25, "description": "[INFERÊNCIA] H1-H3." },
      "normal":  { "value": 1.5,  "description": "[INFERÊNCIA] Corpo." },
      "relaxed": { "value": 1.75, "description": "[INFERÊNCIA] Textos longos." }
    }
  },
  "spacing": {
    "0":  { "value": "0" },
    "1":  { "value": "4px"  },
    "2":  { "value": "8px"  },
    "3":  { "value": "12px" },
    "4":  { "value": "16px" },
    "5":  { "value": "24px" },
    "6":  { "value": "32px" },
    "7":  { "value": "48px" },
    "8":  { "value": "64px" },
    "9":  { "value": "96px" }
  },
  "radius": {
    "none": { "value": "0"    },
    "sm":   { "value": "4px"  },
    "md":   { "value": "8px",  "description": "[INFERÊNCIA] Padrão para cards e botões." },
    "lg":   { "value": "16px", "description": "[INFERÊNCIA] Usado nas imagens emolduradas (página 1 e 2)." },
    "pill": { "value": "9999px" }
  },
  "shadow": {
    "sm":   { "value": "0 1px 2px rgba(11, 42, 67, 0.06)",  "description": "[INFERÊNCIA]" },
    "md":   { "value": "0 4px 12px rgba(11, 42, 67, 0.08)", "description": "[INFERÊNCIA]" },
    "lg":   { "value": "0 12px 32px rgba(11, 42, 67, 0.12)","description": "[INFERÊNCIA] Cards em destaque." },
    "focus":{ "value": "0 0 0 3px rgba(43, 147, 102, 0.35)","description": "[INFERÊNCIA] Anel de foco acessível em verde." }
  },
  "border": {
    "width": {
      "thin":   { "value": "1px" },
      "base":   { "value": "2px", "description": "[INFERÊNCIA] Bordas de cards outline (estilo 'Simplicidade')." },
      "thick":  { "value": "3px" }
    }
  },
  "grid": {
    "unit":       { "value": "8px",  "description": "[INFERÊNCIA] Base do sistema 8pt." },
    "container":  { "value": "1200px","description": "[INFERÊNCIA]" },
    "columns":    { "value": 12,     "description": "[INFERÊNCIA]" },
    "gutter":     { "value": "24px", "description": "[INFERÊNCIA]" }
  }
}
```

### 3.2 Tokens em CSS Custom Properties

```css
:root {
  /* --- Cores de marca --- */
  --bv-color-navy:        #0B2A43;
  --bv-color-green:       #2B9366;

  /* --- Cores neutras --- */
  --bv-color-white:       #FFFFFF;
  --bv-color-black:       #000000;
  --bv-color-bg:          #F1F5F6;   /* [INFERÊNCIA] */
  --bv-color-grid-line:   #E1E7EA;   /* [INFERÊNCIA] */

  /* --- Cores semânticas --- */
  --bv-text-primary:      var(--bv-color-navy);
  --bv-text-secondary:    rgba(11, 42, 67, 0.72); /* [INFERÊNCIA] */
  --bv-text-accent:       var(--bv-color-green);
  --bv-text-inverse:      var(--bv-color-white);
  --bv-bg-surface:        var(--bv-color-white);
  --bv-bg-canvas:         var(--bv-color-bg);
  --bv-bg-brand-primary:  var(--bv-color-navy);
  --bv-bg-brand-accent:   var(--bv-color-green);

  /* --- Tipografia --- */
  --bv-font-heading:      "Gotham", "Helvetica Neue", Arial, sans-serif;
  --bv-font-body:         "Hind", "Poppins", "Helvetica Neue", Arial, sans-serif;

  --bv-fw-regular:        400;
  --bv-fw-medium:         500;  /* [INFERÊNCIA] */
  --bv-fw-semibold:       600;  /* [INFERÊNCIA] */
  --bv-fw-bold:           700;
  --bv-fw-black:          900;  /* [INFERÊNCIA] */

  --bv-fs-display:        3.5rem;   /* 56px */
  --bv-fs-h1:             2.5rem;   /* 40px */
  --bv-fs-h2:             2rem;     /* 32px */
  --bv-fs-h3:             1.5rem;   /* 24px */
  --bv-fs-h4:             1.25rem;  /* 20px */
  --bv-fs-body-lg:        1.125rem; /* 18px */
  --bv-fs-body:           1rem;     /* 16px */
  --bv-fs-body-sm:        0.875rem; /* 14px */
  --bv-fs-caption:        0.75rem;  /* 12px */

  --bv-lh-tight:          1.1;
  --bv-lh-snug:           1.25;
  --bv-lh-normal:         1.5;
  --bv-lh-relaxed:        1.75;

  /* --- Espaçamento (8pt base) --- */
  --bv-space-0:           0;
  --bv-space-1:           0.25rem;  /* 4px  */
  --bv-space-2:           0.5rem;   /* 8px  */
  --bv-space-3:           0.75rem;  /* 12px */
  --bv-space-4:           1rem;     /* 16px */
  --bv-space-5:           1.5rem;   /* 24px */
  --bv-space-6:           2rem;     /* 32px */
  --bv-space-7:           3rem;     /* 48px */
  --bv-space-8:           4rem;     /* 64px */
  --bv-space-9:           6rem;     /* 96px */

  /* --- Raios --- */
  --bv-radius-none:       0;
  --bv-radius-sm:         4px;
  --bv-radius-md:         8px;
  --bv-radius-lg:         16px;
  --bv-radius-pill:       9999px;

  /* --- Sombras (INFERÊNCIA) --- */
  --bv-shadow-sm:         0 1px 2px rgba(11, 42, 67, 0.06);
  --bv-shadow-md:         0 4px 12px rgba(11, 42, 67, 0.08);
  --bv-shadow-lg:         0 12px 32px rgba(11, 42, 67, 0.12);
  --bv-shadow-focus:      0 0 0 3px rgba(43, 147, 102, 0.35);

  /* --- Bordas --- */
  --bv-border-thin:       1px;
  --bv-border-base:       2px;
  --bv-border-thick:      3px;

  /* --- Grid (INFERÊNCIA) --- */
  --bv-grid-container:    1200px;
  --bv-grid-gutter:       24px;

  /* --- Motion (INFERÊNCIA) --- */
  --bv-motion-fast:       150ms;
  --bv-motion-base:       250ms;
  --bv-motion-slow:       400ms;
  --bv-motion-ease:       cubic-bezier(0.2, 0.8, 0.2, 1);
}
```

### 3.3 Tokens em Tailwind (v3) — `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bv: {
          navy:  "#0B2A43",
          green: "#2B9366",
          bg:    "#F1F5F6",   // [INFERÊNCIA]
          grid:  "#E1E7EA",   // [INFERÊNCIA]
        },
      },
      fontFamily: {
        heading: ["Gotham", "Helvetica Neue", "Arial", "sans-serif"],
        body:    ["Hind", "Poppins", "Helvetica Neue", "Arial", "sans-serif"],
      },
      fontSize: {
        display:  ["3.5rem",  { lineHeight: "1.1"  }],
        h1:       ["2.5rem",  { lineHeight: "1.25" }],
        h2:       ["2rem",    { lineHeight: "1.25" }],
        h3:       ["1.5rem",  { lineHeight: "1.25" }],
        h4:       ["1.25rem", { lineHeight: "1.5"  }],
        "body-lg":["1.125rem",{ lineHeight: "1.5"  }],
        body:     ["1rem",    { lineHeight: "1.5"  }],
        "body-sm":["0.875rem",{ lineHeight: "1.5"  }],
        caption:  ["0.75rem", { lineHeight: "1.5"  }],
      },
      borderRadius: {
        bv: {
          sm:   "4px",
          md:   "8px",
          lg:   "16px",
          pill: "9999px",
        },
      },
      boxShadow: {
        "bv-sm":    "0 1px 2px rgba(11, 42, 67, 0.06)",
        "bv-md":    "0 4px 12px rgba(11, 42, 67, 0.08)",
        "bv-lg":    "0 12px 32px rgba(11, 42, 67, 0.12)",
        "bv-focus": "0 0 0 3px rgba(43, 147, 102, 0.35)",
      },
      backgroundImage: {
        // [INFERÊNCIA] Padrão de grid/blueprint recorrente no manual
        "bv-grid": `
          linear-gradient(to right, #E1E7EA 1px, transparent 1px),
          linear-gradient(to bottom, #E1E7EA 1px, transparent 1px)
        `,
      },
      backgroundSize: {
        "bv-grid": "32px 32px",
      },
    },
  },
};
```

---

## 4. Cores

> Fonte: página 8 (*Paleta de Cores*).

### 4.1 Cores Primárias (oficiais)

| Nome | HEX | RGB | HSL | Significado oficial |
|---|---|---|---|---|
| **Navy** (`bv-navy`)  | `#0B2A43` | `rgb(11, 42, 67)`  | `hsl(208, 72%, 15%)` | Representa **confiança, tecnologia e segurança**, reforçando a credibilidade da plataforma. |
| **Green** (`bv-green`)| `#2B9366` | `rgb(43, 147, 102)`| `hsl(152, 55%, 37%)` | Simboliza **movimento, inovação e crescimento**, conectando a marca à ideia de jornada e evolução. |

### 4.2 Cores Neutras `[INFERÊNCIA]`

O manual não declara formalmente as neutras, mas elas aparecem consistentemente em todas as pranchas:

| Nome | HEX | Uso |
|---|---|---|
| `white` | `#FFFFFF` | Superfícies, texto sobre navy/verde |
| `black` | `#000000` | Logo V4/V5, texto técnico monocromático |
| `bg-canvas` | `#F1F5F6` | Fundo de página (blueprint) |
| `grid-line` | `#E1E7EA` | Linhas do padrão quadriculado |

### 4.3 Escalas de Matizes `[INFERÊNCIA]`

O manual não define escalas de tint/shade. Proposta para produto digital:

**Navy scale (`bv-navy-{weight}`):**

| Token | HEX | Uso típico |
|---|---|---|
| `navy-50`  | `#E7ECF0` | Backgrounds de seção, chips informativos |
| `navy-100` | `#CED9E1` | Hover em superfícies claras |
| `navy-200` | `#9DB3C3` | Bordas sutis |
| `navy-300` | `#6C8DA6` | Ícones de estado desativado |
| `navy-400` | `#3B6788` | Links secundários |
| `navy-500` | `#0B2A43` | **Base oficial** |
| `navy-600` | `#092336` | Hover em botões navy |
| `navy-700` | `#071B2A` | Pressed em botões navy |
| `navy-800` | `#04131D` | Texto sobre surfaces navy |
| `navy-900` | `#020810` | Extremo de contraste |

**Green scale (`bv-green-{weight}`):**

| Token | HEX | Uso típico |
|---|---|---|
| `green-50`  | `#E4F4EC` | Background de success / badges |
| `green-100` | `#C9E9D9` | Hover em chips verdes |
| `green-200` | `#95D3B3` | Bordas de highlight |
| `green-300` | `#60BC8C` | Ícones de acento |
| `green-400` | `#3FA675` | Hover em botões verdes |
| `green-500` | `#2B9366` | **Base oficial** |
| `green-600` | `#237652` | Pressed em botões verdes |
| `green-700` | `#1A583E` | Texto verde sobre bg claro |
| `green-800` | `#123B29` | Alta ênfase |
| `green-900` | `#091D14` | Extremo de contraste |

### 4.4 Cores Semânticas `[INFERÊNCIA]`

O manual não cobre estados. Proposta alinhada com as primárias:

| Token | HEX | Uso |
|---|---|---|
| `semantic-success` | `#2B9366` (green-500) | Confirmações, sucesso |
| `semantic-info`    | `#0B2A43` (navy-500)  | Mensagens informativas |
| `semantic-warning` | `#E0A23B` | Alertas não bloqueantes |
| `semantic-danger`  | `#C64343` | Erros e bloqueios |

### 4.5 Regras de Aplicação

**Proporção sugerida `[INFERÊNCIA]` (60/30/10):**
- **60%** neutro (white / bg-canvas) — respiro e clareza.
- **30%** navy — estrutura, tipografia de peso, containers sólidos.
- **10%** verde — acento, CTAs, destaques de movimento/progressão.

**Contraste e acessibilidade:**

| Combinação | Contraste aproximado | WCAG 2.2 |
|---|---|---|
| Navy `#0B2A43` sobre White | 14.8:1 | ✅ AAA |
| White sobre Navy `#0B2A43` | 14.8:1 | ✅ AAA |
| Green `#2B9366` sobre White | 3.9:1 | ⚠️ AA para texto grande (≥18pt/14pt bold); **não usar** para texto pequeno. |
| White sobre Green `#2B9366` | 3.9:1 | ⚠️ AA para texto grande. |
| Navy sobre Green `#2B9366`  | 3.8:1 | ⚠️ Apenas para texto grande/elementos decorativos. |

**Regra prática:**
- Para **texto pequeno (< 18px)** sobre verde, use navy-700 ou escureça o green para `green-700`.
- CTAs: fundo `green-500` com texto `white` é usado em botões com `font-weight ≥ 600` e tamanho `≥ 16px` (atende AA para texto normal nessa escala? — **não atende**; por isso recomenda-se **botão verde com texto navy** OU **botão navy com texto branco** — ver seção 8).

---

## 5. Tipografia

> Fonte: página 9 (*Fontes & Tipografia*). Ver ambiguidade #1.

### 5.1 Fontes Oficiais

| Papel | Fonte | Observação |
|---|---|---|
| **Cabeçalho** | **Gotham** | Declarada como "Fonte do cabeçalho". |
| **Corpo** | **Hind** | Declarada como "Fonte do corpo" (label abaixo do "Aa"). |
| **Corpo (alternativa)** | **Poppins** | Aparece no specimen ao lado, sem label explícito. Ver ambiguidade #1. |

**Recomendação prática para produto digital:**

Gotham é uma fonte licenciada (Hoefler&Co.). Hind e Poppins são open-source (Google Fonts).

- Em **web/app**: usar **Hind** como principal de corpo, **Poppins** como fallback próximo, e **Gotham** para títulos quando licenciada estiver disponível. Se não houver licença Gotham em produção, usar **Poppins SemiBold/Bold** como substituta (proporções compatíveis).

```css
@import url('https://fonts.googleapis.com/css2?family=Hind:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700;900&display=swap');

:root {
  --bv-font-heading: "Gotham", "Poppins", "Helvetica Neue", Arial, sans-serif;
  --bv-font-body:    "Hind", "Poppins", "Helvetica Neue", Arial, sans-serif;
}
```

### 5.2 Escala Tipográfica `[INFERÊNCIA]`

O manual não especifica tamanhos. Escala harmônica baseada em observação das pranchas (títulos em peso `black`, acompanhamento regular) e na base de **16px**:

| Token | Papel | Tamanho | Line-height | Peso | Font-family |
|---|---|---|---|---|---|
| `text-display` | Títulos de abertura ("Manual da Marca") | 56px / 3.5rem | 1.1 | 900 | heading |
| `text-h1` | Seções principais ("Principais Valores") | 40px / 2.5rem | 1.25 | 700–900 | heading |
| `text-h2` | Subseções ("Tom & Voz") | 32px / 2rem | 1.25 | 700 | heading |
| `text-h3` | Cards / blocos | 24px / 1.5rem | 1.25 | 700 | heading |
| `text-h4` | Microtítulos, labels de destaque | 20px / 1.25rem | 1.5 | 600 | heading |
| `text-body-lg` | Intro de parágrafo | 18px / 1.125rem | 1.5 | 400 | body |
| `text-body` | **Base** | 16px / 1rem | 1.5 | 400 | body |
| `text-body-sm` | Texto de apoio, metadados | 14px / 0.875rem | 1.5 | 400 | body |
| `text-caption` | Rodapé ("Manual da Marca • Buscou Viajou") | 12px / 0.75rem | 1.5 | 400, itálico | body |

### 5.3 Padrão Bicolor de Títulos (assinatura visual da marca)

> Fonte: observação direta das páginas 2, 3, 4, 8, 9 e 10.

Recorrente no manual: **primeira palavra em navy + segunda palavra em verde** (ou variação).

Exemplos:
- `Principais` navy + `Valores` verde (pág. 3)
- `Tom &` verde + `Voz` navy (pág. 4)
- `Diretrizes de` verde + `Comunicação` navy (pág. 5)
- `Paleta de` navy + `Cores` verde (pág. 8)
- `Fontes &` navy + `Tipografia` verde (pág. 9)
- `Mockup &` navy + `Aplicação` verde (pág. 10, 11, 12)
- `Manual` navy + `da Marca` verde (pág. 1)

**Regra:** **uma** das palavras em **verde** para marcar a palavra-chave semântica do título. A outra em navy. Evitar mais de duas cores por título.

### 5.4 Regras de Aplicação

- Títulos **sempre** em Gotham (ou fallback Poppins) com peso `≥ 700`.
- Corpo **sempre** em Hind `400` (regular).
- **Destaques inline** (`<strong>` / `<b>`): manter a mesma família, apenas subir para peso `700`.
- **Listas**: usar seta verde (`→`) como bullet em listas de marca (ver página 5); em listas de produto, usar bullets padrão (`•`).
- **Alinhamento**: texto à esquerda por padrão; centralizado apenas em CTAs, títulos de seção curtos ou cards.
- **Itálico**: reservado para a assinatura de rodapé (`Manual da Marca • Buscou Viajou`) e citações.

---

## 6. Espaçamentos e Grid

> `[INFERÊNCIA]` — o manual não define sistema numérico de espaçamento ou grid.

### 6.1 Escala de Espaçamento (sistema 8pt)

Base: **8px**. Múltiplos e uma exceção (4px) para microajustes.

| Token | Valor | Uso típico |
|---|---|---|
| `space-0` | 0 | reset |
| `space-1` | 4px | ícone ↔ texto, gap em chips |
| `space-2` | 8px | padding interno pequeno |
| `space-3` | 12px | gap entre campos de formulário |
| `space-4` | 16px | padding padrão de card |
| `space-5` | 24px | gap entre blocos de mesma seção |
| `space-6` | 32px | separação entre subseções |
| `space-7` | 48px | separação entre seções |
| `space-8` | 64px | margens superiores/inferiores de página |
| `space-9` | 96px | margens de hero |

### 6.2 Grid de Layout

- **Container máximo**: 1200px.
- **Colunas**: 12.
- **Gutter**: 24px.
- **Breakpoints**:

| Nome | min-width |
|---|---|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl`| 1536px |

### 6.3 Padrão de "Blueprint" (grid visual decorativo)

Elemento recorrente em todas as pranchas: **fundo quadriculado claro**, imitando papel de projeto/rota.

```css
.bv-canvas {
  background-color: var(--bv-color-bg);
  background-image:
    linear-gradient(to right,  var(--bv-color-grid-line) 1px, transparent 1px),
    linear-gradient(to bottom, var(--bv-color-grid-line) 1px, transparent 1px);
  background-size: 32px 32px;
}
```

Uso: landing pages, hero sections, seções "sobre a marca". **Evitar** em áreas de produto com muita densidade informacional (dashboards, tabelas) — pode cansar.

### 6.4 Molduras Decorativas em Canto (L-brackets)

> Fonte: páginas 1, 2, 4, 8, 10, 11, 12.

Finas linhas navy formando cantos em L ao redor de imagens/pranchas, sugerindo rota traçada. Reutilização em produto:

```css
.bv-frame-corner {
  position: relative;
}
.bv-frame-corner::before,
.bv-frame-corner::after {
  content: "";
  position: absolute;
  width: 56px; height: 56px;
  border: 2px solid var(--bv-color-navy);
}
.bv-frame-corner::before { top: 0;    left: 0;    border-right: 0; border-bottom: 0; }
.bv-frame-corner::after  { bottom: 0; right: 0;   border-left:  0; border-top:    0; }
```

---

## 7. Bordas, Sombras e Raios

> `[INFERÊNCIA]` — valores propostos com base em observação visual.

### 7.1 Raios (`border-radius`)

| Token | Valor | Uso |
|---|---|---|
| `radius-none` | 0 | Elementos angulares, ex. cards de destaque em navy |
| `radius-sm`   | 4px | Inputs, tags pequenas |
| `radius-md`   | 8px | Botões, cards padrão |
| `radius-lg`   | 16px | Imagens emolduradas (pág. 1 e 2), cards hero |
| `radius-pill` | 9999px | Chips, badges, avatars |

### 7.2 Bordas

| Token | Valor | Uso |
|---|---|---|
| `border-thin`  | 1px | Bordas sutis de inputs |
| `border-base`  | 2px | Cards outline (estilo "Simplicidade" pág. 3) |
| `border-thick` | 3px | Destaques fortes, seletores ativos |

Cores de borda:
- **Default**: `bv-navy` com opacidade 12% (`rgba(11,42,67,0.12)`).
- **Hover**: `bv-navy` com opacidade 24%.
- **Active/Focus**: `bv-green-500`.
- **Error**: `semantic-danger`.

### 7.3 Sombras

| Token | Valor | Uso |
|---|---|---|
| `shadow-sm`    | `0 1px 2px rgba(11,42,67,0.06)`   | Inputs em foco leve, chips |
| `shadow-md`    | `0 4px 12px rgba(11,42,67,0.08)`  | Cards padrão, dropdowns |
| `shadow-lg`    | `0 12px 32px rgba(11,42,67,0.12)` | Modais, cards em hero |
| `shadow-focus` | `0 0 0 3px rgba(43,147,102,0.35)` | Anel de foco (sempre verde para acento acessível) |

**Política de elevação:** sombras em navy semi-transparente (nunca cinza puro) para manter coesão de marca.

---

## 8. Iconografia e Elementos Visuais

> O manual **não define um sistema completo de ícones**. Os únicos elementos gráficos explícitos são:
> - Ícone de **balões de fala** na página 5 (traço navy, estilo outline, cantos arredondados).
> - **Setas verdes** apontando para a direita, usadas em listas (pág. 5).
> - **Setas navy finas** como conectores/anotações (pág. 6, 8).

### 8.1 Diretrizes Inferidas para Ícones `[INFERÊNCIA]`

- **Estilo**: outline, traço `2px`, cantos arredondados (`stroke-linecap: round`, `stroke-linejoin: round`).
- **Tamanho base**: 24px × 24px (padrão), escalável para 16 / 20 / 32 / 48.
- **Cor padrão**: `bv-navy`. Cor de ação/ativo: `bv-green`.
- **Família recomendada**: Lucide, Phosphor ou conjunto outline custom — todos compatíveis com o traço navy 2px observado.
- **Padding interno (grid)**: 1px de "respiro" dentro do canvas do ícone.

### 8.2 Setas Oficiais

- **Seta de lista/bullet**: verde `#2B9366`, traço ~2px, ponta triangular fechada, ≈ 40px de extensão horizontal. Usar antes de itens de lista de marca.
- **Seta de conexão/anotação**: navy, traço fino ~1.5px, curva suave com pequena ponta. Uso decorativo em diagramas e infográficos.

### 8.3 Tagline de Jornada

```
Buscou → Encontrou → Viajou
```

- Fonte: heading (Gotham/Poppins), peso `700–900`.
- Cor: **verde** (`bv-green`).
- Setas: caracter Unicode `→` (U+2192) ou SVG dedicado, na mesma cor e peso visual.
- Uso: assinatura de fechamento, hero secundário, animação de onboarding.

### 8.4 Linguagem Visual de Imagens (direção fotográfica)

> Fonte: pages 1, 2, 4, 10, 11, 12.

- **Pessoas reais** em contexto de mobilidade: motoristas sorrindo, passageiros embarcando, profissionais uniformizados.
- **Sensação**: **acolhimento, profissionalismo e otimismo**.
- **Iluminação**: natural, tons quentes equilibrados.
- **Veículos**: **vans e ônibus brancos** com aplicação do logotipo e elemento gráfico verde em onda/linha curva.
- **Enquadramento**: pessoas com contato visual ou gesto positivo (aceno, polegar para cima).
- **Tratamento**: imagens **emolduradas em cantos arredondados (`radius-lg`)** e, em alguns casos, com moldura L de traço navy.

**Não usar:**
- Fotos com aspecto publicitário exagerado, retocadas em excesso.
- Cenários noturnos escuros (conflita com o território "confiança/movimento claro").
- Pessoas em poses tensas ou contextos caóticos de transporte.

### 8.5 Padrão Gráfico de Aplicação (onda verde nos veículos)

> Fonte: pág. 11 e 12.

Os veículos mockupados trazem uma **onda/linha curva em verde** cruzando a lateral — elemento gráfico derivado do traço dinâmico do monograma "BV". Pode ser reutilizado como:

- Divisor de seção em páginas de produto.
- Elemento de carregamento/loader estilizado.
- Assinatura visual em e-mails marketing.

---

## 9. Componentes Base

> `[INFERÊNCIA]` — derivados a partir dos padrões visuais observados no manual, preservando o DNA da marca.

### 9.1 Botões

| Variante | Bg | Texto | Borda | Uso |
|---|---|---|---|---|
| **Primary** | `bv-navy` | `white` | — | CTA principal |
| **Accent**  | `bv-green`| `white` (ou `bv-navy` se texto < 18px) | — | CTA de ação/movimento |
| **Outline** | `transparent` | `bv-navy` | `2px bv-navy` | Ação secundária |
| **Ghost**   | `transparent` | `bv-navy` | — | Ação terciária |
| **Danger**  | `semantic-danger` | `white` | — | Ação destrutiva |

**Estados (todos):**
- Hover: escurece 8%.
- Pressed: escurece 16%.
- Focus: adiciona `shadow-focus` (anel verde).
- Disabled: opacidade 40%, cursor `not-allowed`.

**Anatomia:**
- `padding`: `space-3 space-5` (12px 24px) para tamanho padrão.
- `border-radius`: `radius-md` (8px).
- `font-weight`: 600.
- `font-size`: 16px (mobile), 16–18px (desktop).
- `min-height`: 44px (acessibilidade touch).

**Exemplo (Tailwind):**

```jsx
// Primary
<button className="bg-bv-navy text-white font-semibold px-6 py-3 rounded-[8px] hover:bg-bv-navy/90 focus:outline-none focus:ring-4 focus:ring-bv-green/35 transition">
  Buscar viagens
</button>

// Accent
<button className="bg-bv-green text-white font-semibold px-6 py-3 rounded-[8px] hover:bg-bv-green/90 focus:outline-none focus:ring-4 focus:ring-bv-green/35 transition">
  Reservar agora
</button>

// Outline
<button className="bg-transparent text-bv-navy border-2 border-bv-navy font-semibold px-6 py-3 rounded-[8px] hover:bg-bv-navy hover:text-white transition">
  Ver detalhes
</button>
```

### 9.2 Cards

Três tratamentos oficiais derivados da página 3 (Valores):

| Variante | Bg | Texto | Borda | Quando usar |
|---|---|---|---|---|
| **Card Outline** | `white` | `navy` | `2px bv-green` | Valores neutros, informações base |
| **Card Accent**  | `bv-green` | `white` | — | Destaque primário, CTAs em cards |
| **Card Brand**   | `bv-navy`  | `white` | — | Destaque de autoridade, dados técnicos |

**Anatomia:**
- `padding`: `space-5` (24px).
- `radius`: `radius-md` (8px).
- `shadow`: `shadow-md` (apenas na variante Outline).
- **Rotação** (opcional, inspirada no card "Inovação"): `transform: rotate(-4deg)` **somente em contextos decorativos/marketing**, nunca em produto transacional.

### 9.3 Inputs e Forms

**Input de texto:**
- `border`: `1px rgba(11,42,67,0.16)`.
- `border-radius`: `radius-md`.
- `padding`: `space-3 space-4` (12px 16px).
- `font-size`: 16px (evitar zoom no iOS).
- **Focus**: borda vira `bv-green`, sombra `shadow-focus`.
- **Erro**: borda `semantic-danger`, mensagem em `body-sm` vermelha abaixo.
- **Label**: acima do input, `body-sm`, `font-weight: 600`, cor `navy`.
- **Placeholder**: `rgba(11,42,67,0.48)`.

**Regra de conteúdo (ligada ao tom da marca):**
- Labels curtas e diretas: `Para onde?`, `Quando?`, `Quantos passageiros?` — nunca `Insira o destino de partida`.
- Placeholders descritivos: `Ex.: Campos do Jordão`.

### 9.4 Chip / Badge

- `radius`: `radius-pill`.
- `padding`: `space-1 space-3` (4px 12px).
- `font-size`: 12px (caption), peso 600.
- Variantes de cor:
  - Neutra: bg `navy-50`, texto `navy-700`.
  - Acento: bg `green-50`, texto `green-700`.
  - Sólida: bg `bv-navy`, texto `white`.

### 9.5 Tag de Jornada (exclusiva da marca)

Componente derivado de "Buscou → Encontrou → Viajou":

```jsx
<ol className="flex items-center gap-3 text-bv-green font-bold font-heading text-lg">
  <li>Buscou</li>
  <li aria-hidden>→</li>
  <li>Encontrou</li>
  <li aria-hidden>→</li>
  <li>Viajou</li>
</ol>
```

### 9.6 Navbar

- Bg: `white`, borda inferior `1px rgba(11,42,67,0.08)`.
- Height: 64px.
- Logo à esquerda (versão primária V1).
- Nav links à direita em `navy-700`, `font-weight: 500`, hover em `bv-green`.
- CTA primário (Navy) à direita do nav.

### 9.7 Footer

- Bg: `bv-navy`.
- Texto: `white`, com links em `white/80`.
- Logo: versão V2 (white on navy).
- Assinatura inferior em itálico, cor `white/60`, tamanho caption:
  ```
  Manual da Marca • Buscou Viajou
  ```

### 9.8 Rodapé de Página Institucional

> Fonte: todas as pranchas.

Todas as páginas do manual trazem, no canto inferior esquerdo, em itálico:

```
Manual da Marca • Buscou Viajou
```

E, no canto inferior direito, o **monograma BV** (em cor oficial navy+green). Pode ser replicado como watermark em apresentações, PDFs institucionais e páginas "sobre a marca".

---

## 10. Regras de Uso

### 10.1 Logotipo

- **Sempre** usar os arquivos SVG oficiais — nunca recriar à mão.
- Manter **proporções originais** (nunca esticar).
- Respeitar **área de proteção**: `[INFERÊNCIA]` distância mínima igual à altura da letra "B" do wordmark.
- **Tamanho mínimo**: `[INFERÊNCIA]` 32px de altura do monograma / 120px de largura do lockup completo em telas digitais.
- Escolher a **variação correta** conforme o fundo (ver tabela 2.3).
- **Nunca** usar o descritor `Fretamento Inteligente` isoladamente.

### 10.2 Cores

- As duas cores primárias são **não-substituíveis**.
- Evitar criar matizes fora da paleta proposta em 4.3 sem validação.
- Para fundos que não sejam white/navy/green, testar contraste (mínimo 4.5:1 para texto).

### 10.3 Tipografia

- Não usar outras famílias fora de Gotham/Hind/Poppins sem validação.
- Não misturar **mais de duas cores** em um mesmo título (padrão bicolor navy+green).
- Não usar `text-transform: uppercase` em parágrafos longos (conflita com "clareza e simplicidade").
- Itálico apenas em rodapés/assinaturas.

### 10.4 Conteúdo / Voz

- Frases ativas, 1 ideia por frase.
- Evitar jargões do setor ("taxa de conversão", "onboarding", "LTV") em superfícies do usuário.
- Usar 2ª pessoa direta (`você`) — próxima, otimista.
- CTAs como **verbos de jornada**: `Buscar`, `Encontrar`, `Viajar`, `Reservar`, `Comparar`.

### 10.5 Imagens

- Fotos autênticas em contexto de mobilidade (pessoas sorrindo, embarque, viagem).
- Sempre emolduradas com `radius-lg` quando em posição de destaque.
- Evitar stock photos genéricas sem relação com transporte/jornada.

---

## 11. Exemplos de Aplicação

### 11.1 Hero de Landing Page (estrutura)

```
┌───────────────────────────────────────────────────────┐
│  [navbar: logo V1 | nav | CTA primário navy]           │
├───────────────────────────────────────────────────────┤
│                                                        │
│   Encontre sua                                         │
│   próxima viagem. (h1 — "Encontre sua" navy, "próxima  │
│                     viagem." verde)                    │
│                                                        │
│   Buscou → Encontrou → Viajou (tag verde)              │
│                                                        │
│   [input: "Para onde?"]  [input: "Quando?"]            │
│   [CTA accent: "Buscar viagens"]                       │
│                                                        │
│               [imagem emoldurada — van/passageiros]    │
│                                                        │
└───────────────────────────────────────────────────────┘
  Fundo: bv-canvas (blueprint grid)
```

### 11.2 Seção de Valores (3 cards)

Reproduz o padrão da página 3 do manual:

```jsx
<section className="py-16 bg-bv-bg">
  <h2 className="font-heading text-h1">
    <span className="text-bv-navy">Principais </span>
    <span className="text-bv-green">Valores</span>
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
    {/* Outline */}
    <article className="border-2 border-bv-green bg-white p-6 rounded-[8px]">
      <h3 className="font-heading font-bold text-bv-navy text-h3">Simplicidade</h3>
      <p className="text-bv-navy/80 mt-3">Acreditamos que viajar deve ser fácil...</p>
    </article>

    {/* Accent (rotated decorativo) */}
    <article className="bg-bv-green text-white p-6 rounded-[8px] md:-rotate-2">
      <h3 className="font-heading font-bold text-h3">Inovação</h3>
      <p className="mt-3">Buscamos constantemente novas tecnologias...</p>
    </article>

    {/* Brand */}
    <article className="bg-bv-navy text-white p-6 rounded-[8px]">
      <h3 className="font-heading font-bold text-h3">Conexão</h3>
      <p className="mt-3">Conectamos pessoas a destinos...</p>
    </article>
  </div>
</section>
```

### 11.3 Card de Resultado de Busca (produto)

```jsx
<article className="bg-white rounded-[8px] shadow-bv-md p-5 flex gap-4">
  <img src="..." alt="Van" className="rounded-[16px] w-40 h-28 object-cover" />
  <div className="flex-1">
    <h3 className="font-heading font-bold text-bv-navy">São Paulo → Campos do Jordão</h3>
    <p className="text-sm text-bv-navy/70">Van executiva • 15 passageiros • 3h</p>
    <div className="mt-2 flex items-center justify-between">
      <span className="text-bv-green font-bold text-h3">R$ 1.240</span>
      <button className="bg-bv-green text-white px-4 py-2 rounded-[8px] font-semibold">
        Reservar
      </button>
    </div>
  </div>
</article>
```

### 11.4 Estado Vazio (empty state)

- Ícone outline em navy.
- Título h3 bicolor.
- Texto de apoio em `body` navy/70.
- CTA accent.

### 11.5 E-mail transacional (trecho)

```
Assunto: Buscou, encontrou — sua viagem está confirmada! ✅

Olá, [nome].

Sua reserva foi confirmada. Veja os detalhes abaixo.
[tabela de dados]

Buscou → Encontrou → Viajou
Equipe Buscou Viajou
```

---

## 12. Guidelines para Manter Consistência

### 12.1 Checklist de Design Review

Antes de publicar uma nova tela, peça/responda:

- [ ] Usou **exclusivamente** a paleta oficial + escala proposta?
- [ ] Títulos estão em Gotham/Poppins bold, com padrão bicolor quando aplicável?
- [ ] CTAs usam **navy (primary)** ou **verde (accent)**, nunca outras cores?
- [ ] Espaçamento obedece ao sistema 8pt?
- [ ] Texto respeita escala (nada fora dos tokens `text-*`)?
- [ ] Contraste mínimo 4.5:1 em textos pequenos?
- [ ] Mensagens são **simples, claras, otimistas**?
- [ ] CTA usa **verbo de jornada**?
- [ ] Imagens têm `radius-lg` em destaques?
- [ ] Ícones são outline 2px, cantos arredondados?
- [ ] Logo na variante correta para o fundo?

### 12.2 Hierarquia de Decisão

Quando existir conflito, aplicar prioridade:

1. **Legibilidade / acessibilidade** (WCAG AA mínimo).
2. **Hierarquia de informação** (o que o usuário precisa ver primeiro?).
3. **Consistência com este design system**.
4. **Estética / expressão de marca**.

Nunca sacrificar 1 por 4.

### 12.3 Governança de Tokens

- **Fonte única**: arquivo `tokens.json` na raiz do repositório (ou módulo de design tokens publicado como pacote interno).
- **Mudanças em tokens** passam por PR com aprovação do time de marca + produto.
- Tokens **nunca** são sobrescritos em componentes — se precisar de valor novo, criar token semântico.
- **Nomenclatura** sempre em kebab-case, prefixada com `bv-`.

### 12.4 Extensão Segura

Quando precisar de algo que o manual não cobre:

1. Primeiro tente compor a partir dos tokens existentes.
2. Se realmente novo, criar token semântico (não um valor bruto solto).
3. Marcar explicitamente como `[INFERÊNCIA]` em documentação até validação de marca.
4. Adicionar ao Storybook com exemplo de uso antes de entrar em produção.

---

## 13. Documentação Técnica Consolidada

### 13.1 Estrutura de Pastas Sugerida (produto)

```
/src
  /design-system
    /tokens
      colors.ts
      typography.ts
      spacing.ts
      radius.ts
      shadow.ts
      motion.ts
      index.ts         # exporta todos os tokens
    /components
      Button/
      Card/
      Input/
      Chip/
      Navbar/
      Footer/
      JourneyTag/      # Buscou → Encontrou → Viajou
    /styles
      tokens.css       # CSS custom properties
      globals.css      # reset + base
    /assets
      /logo            # SVGs oficiais (V1-V5, monogramas)
      /icons
```

### 13.2 Nomenclatura Consistente

- **Tokens**: `bv-{categoria}-{papel}-{variante}` — ex. `bv-color-text-primary`, `bv-space-4`.
- **Componentes**: PascalCase — `Button`, `JourneyTag`.
- **Props**: camelCase — `variant`, `isLoading`.
- **CSS classes**: kebab-case com prefixo `bv-` — `bv-btn`, `bv-card-accent`.
- **Arquivos de asset**: kebab-case — `logo-white-on-navy.svg`.

### 13.3 Export Rápido para Claude Code

Salve este bloco como `src/design-system/tokens/index.ts`:

```ts
export const tokens = {
  color: {
    brand: { navy: "#0B2A43", green: "#2B9366" },
    neutral: { white: "#FFFFFF", black: "#000000", bg: "#F1F5F6", gridLine: "#E1E7EA" },
    text: { primary: "#0B2A43", accent: "#2B9366", inverse: "#FFFFFF" },
  },
  font: {
    heading: "Gotham, Poppins, 'Helvetica Neue', Arial, sans-serif",
    body:    "Hind, Poppins, 'Helvetica Neue', Arial, sans-serif",
  },
  fontSize: {
    display: "3.5rem", h1: "2.5rem", h2: "2rem", h3: "1.5rem", h4: "1.25rem",
    bodyLg: "1.125rem", body: "1rem", bodySm: "0.875rem", caption: "0.75rem",
  },
  space: { 0:"0", 1:"4px", 2:"8px", 3:"12px", 4:"16px", 5:"24px", 6:"32px", 7:"48px", 8:"64px", 9:"96px" },
  radius: { none:"0", sm:"4px", md:"8px", lg:"16px", pill:"9999px" },
  shadow: {
    sm:    "0 1px 2px rgba(11, 42, 67, 0.06)",
    md:    "0 4px 12px rgba(11, 42, 67, 0.08)",
    lg:    "0 12px 32px rgba(11, 42, 67, 0.12)",
    focus: "0 0 0 3px rgba(43, 147, 102, 0.35)",
  },
} as const;

export type Tokens = typeof tokens;
```

---

## Pontos que Exigem Validação

Tudo abaixo é **omisso ou ambíguo no PDF** e precisa ser validado com a equipe de marca/design antes do uso em produto.

### Ambiguidade #1 — Fonte de corpo (Hind vs. Poppins)
A página 9 mostra dois specimens:
- Sob os "Aa": *Gotham* (cabeçalho) e **Hind** (corpo).
- No painel de specimen à direita: *Gotham* e **Poppins**.
- **Ação recomendada:** confirmar qual é oficial para uso em produto digital. Proposta: **Hind** como principal, **Poppins** como fallback (ambas são open-source no Google Fonts).

### Ambiguidade #2 — Licenciamento de Gotham
Gotham é fonte paga (Hoefler&Co.). Não há menção no manual sobre licença para web/app.
- **Ação recomendada:** verificar aquisição de licença web ou adotar **Poppins** (substituta open-source mais próxima) nos títulos.

### Lacuna #1 — Variações técnicas do logotipo
O manual mostra 5 variações visuais, mas não fornece:
- Área mínima de proteção (clear space).
- Tamanho mínimo em pixels/mm.
- Grid de construção do monograma.
- Variação monograma-apenas (sem wordmark).
- Variação horizontal com descritor ao lado (lockup alternativo).

### Lacuna #2 — Escalas, pesos e tamanhos tipográficos
Nenhum tamanho, peso ou line-height foi definido no manual. Toda a escala proposta neste documento é **inferência**.

### Lacuna #3 — Sistema de espaçamento, grid e breakpoints
O manual não documenta. Sistema 8pt, container 1200px, 12 colunas e breakpoints propostos são **inferência**.

### Lacuna #4 — Raios, sombras, bordas
Nenhum valor técnico. Escalas inferidas a partir da observação visual.

### Lacuna #5 — Cores semânticas e estados
Não há definição de success/warning/danger/info nem escalas de tint/shade das primárias. Proposta em 4.3 e 4.4 é inferência.

### Lacuna #6 — Biblioteca de ícones
Apenas dois tipos de ícones aparecem no manual (balões de fala e setas). Não há sistema completo. Recomenda-se **Lucide** ou **Phosphor Outline** como base.

### Lacuna #7 — Componentes de UI
O manual foca em identidade visual (logo, cores, tipografia) e aplicações físicas (ônibus, van, boné, camisa). **Não há protótipos de componentes digitais**. Todos os componentes propostos são inferência fiel aos padrões visuais.

### Lacuna #8 — Dark mode
Nenhuma menção a dark mode. O navy oficial já é profundo, permitindo uso como surface dark — mas contrastes e escalas ainda precisam ser desenhadas e validadas.

### Lacuna #9 — Motion/animação
Nenhuma diretriz. Valores de `motion` propostos são inferência padrão de produto.

### Lacuna #10 — Ilustração
O manual não inclui ilustrações customizadas — usa fotografias. Se o produto digital precisar de ilustrações, um novo sub-sistema precisa ser desenhado e validado.

---

**Versão deste design system:** `v1.0.0 — derivado do manual v1`
**Última atualização:** derivado em 2026-04-19
**Mantido por:** time de Produto/Design da Buscou Viajou (a confirmar)
