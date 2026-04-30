'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, User } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils/cn';

/**
 * Navbar do site Buscou Viajou.
 * design-dna.json → componentRules.navbar
 *
 * - bg white
 * - height 64px (sticky)
 * - logo V1 à esquerda
 * - links navy-700, hover green
 * - CTA primário à direita
 * - mobile: burger → Sheet right
 */

interface NavLink {
  label: string;
  href: string;
}

export interface NavbarProps {
  /** Links do meio. Default: rotas públicas */
  links?: NavLink[];
  /** Estado de sessão */
  user?: {
    firstName: string;
    avatarUrl?: string | null;
  } | null;
  className?: string;
}

const DEFAULT_LINKS: NavLink[] = [
  { label: 'Como funciona', href: '/#como-funciona' },
];

export function Navbar({ links = DEFAULT_LINKS, user, className }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full bg-white border-b border-bv-navy/8',
        'h-16 flex items-center',
        className,
      )}
    >
      <div className="container mx-auto max-w-bv-container px-bv-5 flex items-center justify-between gap-bv-5">
        <Link
          href="/"
          aria-label="Buscou Viajou — Home"
          className="shrink-0 focus-visible:outline-none focus-visible:rounded-bv-sm focus-visible:shadow-bv-focus"
        >
          {/* Mobile: monograma compacto */}
          <span className="md:hidden">
            <Logo variant="monogramFullColor" height={36} priority />
          </span>
          {/* Desktop: lockup completo */}
          <span className="hidden md:inline-block">
            <Logo variant="fullColor" height={40} priority />
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-bv-5" aria-label="Navegação principal">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-body font-medium text-bv-navy-700 hover:text-bv-green transition-colors duration-bv-fast focus-visible:outline-none focus-visible:rounded-bv-sm focus-visible:shadow-bv-focus px-bv-1 py-bv-1"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-bv-3 shrink-0">
          {user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild variant="accent" size="sm">
                <Link href="/">Buscar viagens</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              className="md:hidden h-11 w-11 -mr-bv-2 flex items-center justify-center rounded-bv-sm text-bv-navy hover:bg-bv-navy-50 focus-visible:outline-none focus-visible:shadow-bv-focus"
              aria-label="Abrir menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="mt-bv-6 flex flex-col gap-bv-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-bv-3 text-body-lg font-medium text-bv-navy hover:text-bv-green border-b border-bv-navy/8"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-bv-5 flex flex-col gap-bv-3">
                {user ? (
                  <>
                    <div className="text-body-sm text-bv-navy/72">Olá, {user.firstName}</div>
                    <Button asChild variant="primary" fullWidth>
                      <Link href="/minhas-viagens" onClick={() => setMobileOpen(false)}>
                        Minhas viagens
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="accent" fullWidth>
                      <Link href="/" onClick={() => setMobileOpen(false)}>
                        Buscar viagens
                      </Link>
                    </Button>
                    <Button asChild variant="outline" fullWidth>
                      <Link href="/login" onClick={() => setMobileOpen(false)}>
                        Entrar
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

function UserMenu({ user }: { user: { firstName: string; avatarUrl?: string | null } }) {
  return (
    <Link
      href="/minhas-viagens"
      className="flex items-center gap-bv-2 rounded-bv-pill bg-bv-navy-50 hover:bg-bv-navy-100 px-bv-2 py-bv-1 text-body-sm font-medium text-bv-navy transition-colors duration-bv-fast focus-visible:outline-none focus-visible:shadow-bv-focus"
    >
      <span className="h-7 w-7 rounded-full bg-bv-navy flex items-center justify-center text-white text-caption font-semibold uppercase">
        {user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatarUrl} alt="" className="h-full w-full rounded-full object-cover" />
        ) : (
          user.firstName[0] ?? <User className="h-3.5 w-3.5" />
        )}
      </span>
      <span>{user.firstName}</span>
    </Link>
  );
}
