'use client';

import * as React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/**
 * FaqAccordion — FAQ accordion com Radix.
 * Cada item = pergunta clicável (Trigger) + resposta (Content).
 * Visual editorial: linhas divisórias finas, ícone + giratório no trigger,
 * conteúdo em corpo Hind regular.
 *
 * A11y: Radix gerencia aria-expanded, keyboard nav, focus.
 */
export interface FaqItem {
  id: string;
  question: string;
  /** Resposta — pode conter <strong> ou <a> via React.ReactNode */
  answer: React.ReactNode;
}

export interface FaqAccordionProps {
  items: FaqItem[];
  className?: string;
}

export function FaqAccordion({ items, className }: FaqAccordionProps) {
  const [openId, setOpenId] = React.useState<string | undefined>(items[0]?.id);

  return (
    <Accordion.Root
      type="single"
      collapsible
      value={openId}
      onValueChange={(v) => setOpenId(v || undefined)}
      className={cn('divide-y divide-bv-navy/12 border-y border-bv-navy/12', className)}
    >
      {items.map((item) => (
        <Accordion.Item key={item.id} value={item.id} className="group">
          <Accordion.Header asChild>
            <h3 className="font-heading">
              <Accordion.Trigger
                className={cn(
                  'flex items-center justify-between gap-bv-4 w-full',
                  'min-h-[44px] py-bv-5 text-left',
                  'font-heading font-bold text-h4 md:text-h3 text-bv-navy leading-snug',
                  'transition-colors duration-bv-base',
                  'hover:text-bv-green',
                  'focus-visible:outline-none focus-visible:shadow-bv-focus focus-visible:rounded-bv-sm',
                  '[&[data-state=open]_.faq-icon]:rotate-45',
                  '[&[data-state=open]_.faq-icon]:text-bv-green',
                )}
              >
                <span>{item.question}</span>
                <span
                  aria-hidden
                  className="faq-icon shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-bv-pill border border-bv-navy/16 text-bv-navy transition-transform duration-bv-base"
                >
                  <Plus size={18} strokeWidth={2.5} />
                </span>
              </Accordion.Trigger>
            </h3>
          </Accordion.Header>
          <Accordion.Content
            className={cn(
              'overflow-hidden text-body text-bv-navy/80 leading-relaxed',
              'data-[state=open]:animate-accordion-down',
              'data-[state=closed]:animate-accordion-up',
            )}
          >
            <div className="pb-bv-5 max-w-2xl">{item.answer}</div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
