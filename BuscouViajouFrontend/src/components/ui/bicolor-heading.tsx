import * as React from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Padrão bicolor de títulos — assinatura visual da marca.
 * UMA palavra (ou frase curta) em verde, RESTO em navy.
 *
 * design-dna.json → visualEffects.bicolorTitle
 *
 * Uso recomendado:
 *
 *   <BicolorHeading as="h1" size="display">
 *     Encontre sua <BicolorHighlight>próxima viagem</BicolorHighlight>.
 *   </BicolorHeading>
 *
 * Ou via API rápida:
 *
 *   <BicolorHeading
 *     as="h2"
 *     size="h1"
 *     navy="Compare"
 *     green="milhares"
 *     trailing="de veículos."
 *   />
 */

type Tag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
type Size = 'display' | 'h1' | 'h2' | 'h3' | 'h4';

const SIZE_CLASS: Record<Size, string> = {
  display: 'text-display font-heading font-black',
  h1:      'text-h1 font-heading font-bold',
  h2:      'text-h2 font-heading font-bold',
  h3:      'text-h3 font-heading font-bold',
  h4:      'text-h4 font-heading font-semibold',
};

interface BaseProps {
  as?: Tag;
  size?: Size;
  className?: string;
}

interface SimpleProps extends BaseProps {
  /** Parte navy do título (vem antes da parte verde) */
  navy?: string;
  /** Parte verde — palavra-chave semântica */
  green?: string;
  /** Texto que vem depois da parte verde, em navy */
  trailing?: string;
}

interface ChildrenProps extends BaseProps {
  children: React.ReactNode;
}

export type BicolorHeadingProps = SimpleProps | ChildrenProps;

export function BicolorHeading(props: BicolorHeadingProps) {
  const { as: Tag = 'h2', size = 'h1', className } = props;
  const baseClass = cn(SIZE_CLASS[size], 'leading-tight', className);

  if ('children' in props) {
    return <Tag className={cn(baseClass, 'text-bv-navy')}>{props.children}</Tag>;
  }

  const { navy, green, trailing } = props;
  return (
    <Tag className={baseClass}>
      {navy && <span className="text-bv-navy">{navy}</span>}
      {navy && green && ' '}
      {green && <span className="text-bv-green">{green}</span>}
      {trailing && <span className="text-bv-navy">{trailing}</span>}
    </Tag>
  );
}

/** Span verde pra usar dentro de BicolorHeading com children */
export function BicolorHighlight({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn('text-bv-green', className)}>{children}</span>;
}
