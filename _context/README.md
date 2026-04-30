# Buscou Viajou — Design System (pacote de entrega)

Arquivos nesta pasta:

| Arquivo | Uso |
|---|---|
| `buscou-viajou-design-system.md` | **Documento completo**. Leia primeiro. |
| `tokens.json` | Design tokens no padrão W3C DTCG. Importável por Style Dictionary, Tokens Studio, etc. |
| `tokens.css` | Variáveis CSS prontas (`--bv-*`) + utilitários (`.bv-canvas`, `.bv-frame-corner`). |
| `tailwind.config.js` | Config Tailwind v3 com paleta, tipografia, radius, shadow, utilitários. |

## Começar rápido (Claude Code / Next.js)

```bash
# 1. Copie os arquivos
cp tokens.css src/styles/tokens.css
cp tailwind.config.js ./tailwind.config.js

# 2. Importe no seu CSS global
echo '@import "./styles/tokens.css";' >> src/styles/globals.css
```

Em um componente:

```jsx
export function Hero() {
  return (
    <section className="bv-canvas min-h-[600px] px-bv-6 py-bv-8">
      <h1 className="font-heading text-display">
        <span className="text-bv-navy">Encontre sua </span>
        <span className="text-bv-green">próxima viagem.</span>
      </h1>
      <p className="font-body text-bv-navy/72 mt-bv-4 max-w-xl">
        Buscou, encontrou, viajou. Sem complicação.
      </p>
      <button className="mt-bv-6 bg-bv-green text-white font-semibold px-bv-6 py-bv-3 rounded-bv-md shadow-bv-md hover:bg-bv-green-600 focus:outline-none focus:shadow-bv-focus transition-colors duration-bv-base ease-bv-ease">
        Buscar viagens
      </button>
    </section>
  );
}
```

## Checklist antes de subir para produção

- [ ] Confirmar licença de **Gotham** para web (ou trocar por Poppins).
- [ ] Validar escolha entre **Hind vs. Poppins** como fonte de corpo.
- [ ] Exportar **SVGs oficiais** das 5 variações do logotipo para `/assets/brand/`.
- [ ] Validar cores semânticas (warning/danger) com o time de marca.
- [ ] Revisar contraste em CTAs verdes com texto < 18px.
- [ ] Definir dark mode se for necessário.

## Pontos críticos destacados

Todos os itens marcados `[INFERÊNCIA]` / `[INFERRED]` **não estão no manual original** e foram inferidos para viabilizar o uso em produto digital. Consulte a seção **"Pontos que Exigem Validação"** no final de `buscou-viajou-design-system.md` para a lista completa das 10 lacunas/ambiguidades identificadas.
