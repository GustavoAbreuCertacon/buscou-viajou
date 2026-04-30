import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * Tailwind merge customizado pra reconhecer nossas font-sizes do DS:
 * `text-display`, `text-h1` ... `text-caption`. Sem isso, twMerge confunde
 * `text-body` com `text-white` (ambos viram "text-*" no grupo padrão).
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        { text: ['display', 'h1', 'h2', 'h3', 'h4', 'body-lg', 'body', 'body-sm', 'caption'] },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
