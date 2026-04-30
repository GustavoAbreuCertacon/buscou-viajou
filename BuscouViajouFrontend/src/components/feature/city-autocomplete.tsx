'use client';

import * as React from 'react';
import { MapPin } from 'lucide-react';
import { Input, type InputProps } from '@/components/ui/input';
import { api } from '@/lib/api/client';
import type { CityHit } from '@/lib/api/types';
import { cn } from '@/lib/utils/cn';

interface Props extends Omit<InputProps, 'value' | 'onChange' | 'iconLeft'> {
  value: string;
  onChange: (value: string, city?: CityHit) => void;
}

/**
 * CityAutocomplete — busca cidades brasileiras com debounce 300ms via /v1/cities/search.
 * Lista dropdown com até 8 sugestões. Selecionar preenche o input + dispara onChange com city.
 */
export function CityAutocomplete({ value, onChange, placeholder, ...rest }: Props) {
  const [query, setQuery] = React.useState(value);
  const [results, setResults] = React.useState<CityHit[]>([]);
  const [open, setOpen] = React.useState(false);
  const [activeIdx, setActiveIdx] = React.useState(-1);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Sync controlled value
  React.useEffect(() => {
    setQuery(value);
  }, [value]);

  // Debounced fetch
  React.useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const data = await api<CityHit[]>(`/v1/cities/search?q=${encodeURIComponent(query)}`, {
          auth: false,
        });
        setResults(data);
      } catch {
        setResults([]);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close
  React.useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function select(city: CityHit) {
    setQuery(city.label);
    onChange(city.label, city);
    setOpen(false);
    setActiveIdx(-1);
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      select(results[activeIdx]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <Input
        {...rest}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
          setOpen(true);
          setActiveIdx(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKey}
        iconLeft={<MapPin className="h-4 w-4" />}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-controls="city-listbox"
        aria-autocomplete="list"
      />
      {open && results.length > 0 && (
        <ul
          id="city-listbox"
          role="listbox"
          className="absolute left-0 right-0 z-30 mt-1 max-h-72 overflow-auto rounded-bv-md border border-bv-navy/12 bg-white shadow-bv-lg"
        >
          {results.map((c, i) => (
            <li
              key={`${c.name}-${c.state}`}
              role="option"
              aria-selected={i === activeIdx}
              onMouseDown={(e) => {
                e.preventDefault();
                select(c);
              }}
              onMouseEnter={() => setActiveIdx(i)}
              className={cn(
                'flex items-center gap-bv-3 px-bv-4 py-bv-3 cursor-pointer text-body',
                i === activeIdx ? 'bg-bv-navy-50 text-bv-navy' : 'text-bv-navy hover:bg-bv-navy-50',
              )}
            >
              <MapPin size={16} className="text-bv-navy/48 shrink-0" strokeWidth={2} />
              <span>
                <span className="font-medium">{c.name}</span>
                <span className="text-bv-navy/72">, {c.state}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
