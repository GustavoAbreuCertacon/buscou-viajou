import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { JourneyTag } from '@/components/ui/journey-tag';
import { cn } from '@/lib/utils/cn';

/**
 * Footer do site.
 * design-dna.json → componentRules.footer
 *
 * - bg navy
 * - logo V2 (white-on-navy)
 * - texto white com opacidades
 * - linha de baixo: italic, white/60
 */

interface FooterColumn {
  title: string;
  links: Array<{ label: string; href: string }>;
}

const COLUMNS: FooterColumn[] = [
  {
    title: 'Buscou',
    links: [
      { label: 'Como funciona', href: '/#como-funciona' },
      { label: 'Termos de uso', href: '/termos' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Sobre nós', href: '/sobre' },
      { label: 'Blog', href: '/blog' },
      { label: 'Privacidade', href: '/privacidade' },
    ],
  },
  {
    title: 'Suporte',
    links: [
      { label: 'Central de ajuda', href: '/ajuda' },
      { label: 'Contato', href: '/contato' },
      { label: 'Cookies', href: '/cookies' },
    ],
  },
];

export interface FooterProps {
  className?: string;
  columns?: FooterColumn[];
}

export function Footer({ className, columns = COLUMNS }: FooterProps) {
  return (
    <footer className={cn('bg-bv-navy text-white', className)}>
      <div className="container mx-auto max-w-bv-container px-bv-5 py-bv-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-bv-7">
          {/* Brand column */}
          <div className="md:col-span-1 flex flex-col gap-bv-4">
            <Logo variant="white" height={36} />
            <p className="text-body-sm text-white/72 max-w-xs">
              Buscou, encontrou, viajou. Compare e reserve fretamento de ônibus, vans e micro-ônibus em todo o Brasil.
            </p>
            <div className="mt-bv-2">
              <JourneyTag size="sm" inverse />
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-body font-heading font-semibold text-white mb-bv-3">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-bv-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-white/72 hover:text-bv-green-300 transition-colors duration-bv-fast focus-visible:outline-none focus-visible:rounded-bv-sm focus-visible:shadow-bv-focus"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-bv-7 pt-bv-5 border-t border-white/12 flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-bv-3">
          <p className="text-caption text-white/60 italic">
            Manual da Marca · Buscou Viajou
          </p>
          <p className="text-caption text-white/60">
            © {new Date().getFullYear()} Buscou Viajou. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
