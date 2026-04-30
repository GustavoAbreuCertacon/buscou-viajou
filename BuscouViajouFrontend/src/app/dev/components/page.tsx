'use client';

import * as React from 'react';
import { Search, MapPin, Heart, Calendar as CalendarIcon, Bus } from 'lucide-react';
import {
  Button,
  Badge,
  Skeleton,
  Logo,
  Label,
  Input,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Checkbox,
  RadioGroup,
  RadioItem,
  Stepper,
  DatePicker,
  StarRating,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  BicolorHeading,
  BicolorHighlight,
  JourneyTag,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SimpleTooltip,
  toast,
} from '@/components/ui';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

/**
 * /_dev/components — showcase de todos os componentes do DS pra revisão visual.
 * Esta rota é interna (noindex). Pode ser removida em produção.
 */
export default function ComponentsShowcase() {
  const [stepperValue, setStepperValue] = React.useState(10);
  const [date, setDate] = React.useState<Date | undefined>();
  const [rating, setRating] = React.useState(4);
  const [agreed, setAgreed] = React.useState(false);

  return (
    <div className="min-h-screen bg-bv-bg pb-bv-9">
      <Navbar />
      <main className="container mx-auto max-w-bv-container px-bv-5 py-bv-7 space-y-bv-9">
        <header className="space-y-bv-3">
          <BicolorHeading as="h1" size="display" navy="Design" green="System" />
          <p className="text-body-lg text-bv-navy/72 max-w-2xl">
            Showcase dos componentes UI primitivos. Cada bloco abaixo demonstra
            variantes, estados e regras consumidas de{' '}
            <code className="font-mono text-bv-green-700">design-dna.json</code>.
          </p>
        </header>

        {/* ── LOGO ──────────────────────────────────── */}
        <Section title="Logo" subtitle="8 variações + favicon. Use a primária por default.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-bv-5">
            <ShowcaseTile label="V1 — Primária (SVG)" bg="white">
              <Logo variant="fullColor" height={48} />
            </ShowcaseTile>
            <ShowcaseTile label="V2 — White on Navy" bg="navy">
              <Logo variant="whiteOnNavy" height={48} />
            </ShowcaseTile>
            <ShowcaseTile label="V3 — White on Green" bg="green">
              <Logo variant="whiteOnGreen" height={48} />
            </ShowcaseTile>
            <ShowcaseTile label="V4 — Black (1-tinta)" bg="white">
              <Logo variant="black" height={48} />
            </ShowcaseTile>
            <ShowcaseTile label="V5 — White (transparent)" bg="navy">
              <Logo variant="white" height={48} />
            </ShowcaseTile>
            <ShowcaseTile label="Monogramas" bg="white">
              <div className="flex items-end gap-bv-4">
                <Logo variant="monogramFullColor" height={48} />
                <Logo variant="monogramBlack" height={48} />
                <div className="bg-bv-navy p-bv-2 rounded-bv-sm">
                  <Logo variant="monogramWhite" height={48} />
                </div>
              </div>
            </ShowcaseTile>
          </div>
        </Section>

        {/* ── BICOLOR HEADING ──────────────────────────── */}
        <Section title="Bicolor Heading" subtitle="Padrão bicolor de títulos — assinatura visual.">
          <div className="space-y-bv-4">
            <BicolorHeading as="h2" size="h1" navy="Encontre sua" green="próxima viagem" trailing="." />
            <BicolorHeading as="h3" size="h2">
              Compare <BicolorHighlight>milhares</BicolorHighlight> de veículos
            </BicolorHeading>
            <BicolorHeading as="h4" size="h3" navy="Princípios" green="de Design" />
            <BicolorHeading as="p" size="h4" navy="Tom &" green="Voz" />
          </div>
        </Section>

        {/* ── JOURNEY TAG ──────────────────────────────── */}
        <Section title="Journey Tag" subtitle="Buscou → Encontrou → Viajou (assinatura, use com moderação)">
          <div className="space-y-bv-4">
            <JourneyTag size="sm" />
            <JourneyTag size="md" />
            <JourneyTag size="lg" />
            <div className="bg-bv-navy p-bv-5 rounded-bv-md">
              <JourneyTag size="md" inverse />
            </div>
          </div>
        </Section>

        {/* ── BUTTONS ──────────────────────────────────── */}
        <Section title="Buttons" subtitle="5 variantes × 4 tamanhos × estados">
          <div className="space-y-bv-5">
            <Row label="Variantes (size md)">
              <Button variant="primary">Buscar viagens</Button>
              <Button variant="accent">Reservar agora</Button>
              <Button variant="outline">Ver detalhes</Button>
              <Button variant="ghost">Cancelar</Button>
              <Button variant="danger">Excluir reserva</Button>
              <Button variant="link">Esqueci a senha</Button>
            </Row>

            <Row label="Tamanhos">
              <Button variant="primary" size="sm">Pequeno</Button>
              <Button variant="primary" size="md">Médio (default)</Button>
              <Button variant="primary" size="lg">Grande</Button>
              <Button variant="primary" size="icon" aria-label="Buscar">
                <Search className="h-4 w-4" />
              </Button>
            </Row>

            <Row label="Com ícones">
              <Button variant="accent" iconLeft={<Search className="h-4 w-4" />}>
                Buscar
              </Button>
              <Button variant="primary" iconRight={<Heart className="h-4 w-4" />}>
                Favoritar
              </Button>
            </Row>

            <Row label="Estados">
              <Button variant="primary" loading loadingText="Buscando viagens…">
                Buscar
              </Button>
              <Button variant="primary" disabled>
                Desabilitado
              </Button>
              <Button variant="accent" fullWidth>
                Largura total
              </Button>
            </Row>
          </div>
        </Section>

        {/* ── BADGES ───────────────────────────────────── */}
        <Section title="Badges / Chips" subtitle="Pílulas pra status, tags, indicadores">
          <Row label="Variantes">
            <Badge variant="neutral">Neutral</Badge>
            <Badge variant="accent">Acento</Badge>
            <Badge variant="solidNavy">Sólido Navy</Badge>
            <Badge variant="solidGreen">Sólido Green</Badge>
            <Badge variant="warning">Atenção</Badge>
            <Badge variant="danger">Erro</Badge>
            <Badge variant="outlineNavy">Outline Navy</Badge>
            <Badge variant="outlineGreen">Outline Green</Badge>
          </Row>
          <Row label="Pricing badges (do PRD §6.10)">
            <Badge variant="solidGreen">🟢 Melhor preço</Badge>
            <Badge variant="warning">🟡 Alta procura +20%</Badge>
            <Badge variant="danger">🔴 Preço de pico +80%</Badge>
          </Row>
        </Section>

        {/* ── STAR RATING ──────────────────────────────── */}
        <Section title="Star Rating" subtitle="Display ou interativo, com valor + contador opcional">
          <Row label="Display">
            <StarRating value={4.6} size="sm" />
            <StarRating value={4.6} size="md" showValue count={152} />
            <StarRating value={5} size="lg" showValue />
          </Row>
          <Row label="Interativo">
            <StarRating value={rating} onChange={setRating} size="md" />
            <span className="text-body text-bv-navy/72">Sua nota: {rating}</span>
          </Row>
        </Section>

        {/* ── INPUTS / FORMS ───────────────────────────── */}
        <Section title="Forms" subtitle="Voz da marca em labels e placeholders">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-bv-5 max-w-3xl">
            <div className="flex flex-col gap-bv-2">
              <Label htmlFor="origem">Para onde?</Label>
              <Input
                id="origem"
                placeholder="Ex.: Campos do Jordão"
                iconLeft={<MapPin className="h-4 w-4" />}
              />
            </div>
            <div className="flex flex-col gap-bv-2">
              <Label htmlFor="destino" required>De onde?</Label>
              <Input
                id="destino"
                placeholder="São Paulo"
                error="Origem e destino devem ser diferentes."
              />
            </div>
            <div className="flex flex-col gap-bv-2">
              <Label htmlFor="data">Quando?</Label>
              <DatePicker value={date} onChange={setDate} placeholder="Selecionar data" id="data" />
            </div>
            <div className="flex flex-col gap-bv-2">
              <Label>Quantos passageiros?</Label>
              <Stepper value={stepperValue} onChange={setStepperValue} min={1} max={60} unitLabel="passageiros" />
            </div>
            <div className="md:col-span-2 flex flex-col gap-bv-2">
              <Label htmlFor="comentario">Comentário (opcional)</Label>
              <Textarea
                id="comentario"
                placeholder="Conte como foi a viagem..."
                maxLength={500}
                showCounter
                value=""
                onChange={() => {}}
              />
            </div>
          </div>

          <div className="mt-bv-6 grid grid-cols-1 md:grid-cols-2 gap-bv-5 max-w-3xl">
            <div className="flex flex-col gap-bv-2">
              <Label>Tipo de veículo</Label>
              <Select defaultValue="bus">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bus">Ônibus</SelectItem>
                  <SelectItem value="minibus">Micro-ônibus</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-bv-3">
              <Label>Comodidades (escolha)</Label>
              <div className="flex flex-col gap-bv-2">
                {['Wi-Fi', 'Ar-condicionado', 'Banheiro', 'Tomada USB'].map((a) => (
                  <label key={a} className="flex items-center gap-bv-2 cursor-pointer text-body text-bv-navy">
                    <Checkbox /> {a}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-bv-3">
              <Label>Ordenar por</Label>
              <RadioGroup defaultValue="relevant">
                {[
                  { v: 'relevant', l: 'Mais relevante' },
                  { v: 'price', l: 'Menor preço' },
                  { v: 'rating', l: 'Melhor avaliação' },
                ].map((o) => (
                  <label key={o.v} className="flex items-center gap-bv-2 cursor-pointer text-body text-bv-navy">
                    <RadioItem value={o.v} /> {o.l}
                  </label>
                ))}
              </RadioGroup>
            </div>

            <div className="flex flex-col gap-bv-3">
              <label className="flex items-center gap-bv-2 cursor-pointer text-body text-bv-navy">
                <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(!!v)} />
                Aceito os termos de uso
              </label>
            </div>
          </div>
        </Section>

        {/* ── CARDS ────────────────────────────────────── */}
        <Section title="Cards" subtitle="5 variantes + composição header/title/description/footer">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-bv-5">
            <Card variant="default">
              <CardHeader>
                <CardTitle>Card padrão</CardTitle>
                <CardDescription>White bg, border sutil, shadow-md.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body text-bv-navy">Use pra conteúdo geral, listagens.</p>
              </CardContent>
              <CardFooter>
                <Button variant="primary" size="sm">Ação</Button>
              </CardFooter>
            </Card>

            <Card variant="outline">
              <CardHeader>
                <CardTitle>Card outline</CardTitle>
                <CardDescription>Border verde 2px, white bg.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body text-bv-navy">Para valores, marketing, destaques.</p>
              </CardContent>
            </Card>

            <Card variant="accent" rotate="leftStrong">
              <CardTitle className="text-white">Inovação</CardTitle>
              <CardDescription className="text-white/80 mt-bv-2">
                Card accent rotacionado — só em marketing.
              </CardDescription>
            </Card>

            <Card variant="brand">
              <CardTitle className="text-white">Conexão</CardTitle>
              <CardDescription className="text-white/80 mt-bv-2">
                Bloco navy de autoridade.
              </CardDescription>
            </Card>

            <Card variant="interactive" tabIndex={0} role="button">
              <CardTitle>Card interativo</CardTitle>
              <CardDescription>Hover muda elevação. Foco verde.</CardDescription>
            </Card>
          </div>
        </Section>

        {/* ── SKELETON ────────────────────────────────── */}
        <Section title="Skeleton" subtitle="Sempre estrutural, nunca spinner genérico">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-bv-5 max-w-3xl">
            <div className="space-y-bv-3">
              <Skeleton className="h-40 w-full" />
              <Skeleton shape="text" className="w-3/4" />
              <Skeleton shape="text" className="w-1/2" />
            </div>
            <div className="flex items-center gap-bv-3">
              <Skeleton shape="circle" className="h-12 w-12" />
              <div className="flex-1 space-y-bv-2">
                <Skeleton shape="text" className="w-3/4" />
                <Skeleton shape="text" className="w-1/2" />
              </div>
            </div>
          </div>
        </Section>

        {/* ── OVERLAYS ────────────────────────────────── */}
        <Section title="Overlays" subtitle="Dialog, Sheet, Tooltip, Toast">
          <Row label="Dialog">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="primary">Cancelar reserva</Button>
              </DialogTrigger>
              <DialogContent size="md">
                <DialogHeader>
                  <DialogTitle>Cancelar esta reserva?</DialogTitle>
                  <DialogDescription>
                    Como faltam mais de 72h pra viagem, você receberá <strong>100% de reembolso</strong>.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="ghost">Voltar</Button>
                  <Button variant="danger">Confirmar cancelamento</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Row>

          <Row label="Sheet (mobile)">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Abrir filtros</Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                  <SheetDescription>Refine sua busca.</SheetDescription>
                </SheetHeader>
                <div className="text-body text-bv-navy/72">Conteúdo dos filtros aqui...</div>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost">Sheet inferior</Button>
              </SheetTrigger>
              <SheetContent side="bottom">
                <SheetHeader>
                  <SheetTitle>Compartilhar</SheetTitle>
                </SheetHeader>
                <p className="text-body text-bv-navy">Bottom sheet — útil em mobile.</p>
              </SheetContent>
            </Sheet>
          </Row>

          <Row label="Tooltip">
            <SimpleTooltip text="Ajuda contextual sutil">
              <Button variant="ghost" size="icon" aria-label="Ajuda">
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </SimpleTooltip>
          </Row>

          <Row label="Toasts">
            <Button onClick={() => toast.success('Reserva confirmada!', { description: 'Você já pode ver seu bilhete.' })}>
              Success
            </Button>
            <Button variant="ghost" onClick={() => toast.info('Atualizamos os preços', { description: 'Sua busca foi reprocessada.' })}>
              Info
            </Button>
            <Button variant="ghost" onClick={() => toast.warning('Cotação expira em 5 min')}>
              Warning
            </Button>
            <Button variant="ghost" onClick={() => toast.error('Algo deu errado', { description: 'Código: 7d00f8de-c5d1' })}>
              Danger
            </Button>
          </Row>
        </Section>

        {/* ── BLUEPRINT GRID ──────────────────────────── */}
        <Section title="Blueprint Grid" subtitle="Pattern de fundo da landing — bv-canvas">
          <div className="bv-canvas rounded-bv-md p-bv-7 min-h-[200px] flex items-center justify-center">
            <BicolorHeading as="span" size="h2" navy="Encontre sua" green="próxima viagem" />
          </div>
        </Section>

        {/* ── FRAME CORNER ─────────────────────────────── */}
        <Section title="Frame Corner" subtitle="L-brackets navy em imagens destacadas — bv-frame-corner">
          <div className="bv-frame-corner inline-block p-bv-6">
            <div className="w-64 h-40 bg-bv-navy-100 rounded-bv-lg flex items-center justify-center">
              <Bus className="h-16 w-16 text-bv-navy" />
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-bv-5">
      <div>
        <h2 className="font-heading font-bold text-h2 text-bv-navy">{title}</h2>
        {subtitle && <p className="text-body text-bv-navy/72 mt-bv-1">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-bv-2">
      <div className="text-body-sm font-semibold text-bv-navy/72 uppercase tracking-wide">
        {label}
      </div>
      <div className="flex flex-wrap items-center gap-bv-3">{children}</div>
    </div>
  );
}

function ShowcaseTile({
  label,
  bg,
  children,
}: {
  label: string;
  bg: 'white' | 'navy' | 'green';
  children: React.ReactNode;
}) {
  const bgClass = {
    white: 'bg-white border border-bv-navy/12',
    navy: 'bg-bv-navy',
    green: 'bg-bv-green',
  }[bg];

  return (
    <div className="space-y-bv-2">
      <div className={`${bgClass} rounded-bv-md p-bv-6 flex items-center justify-center min-h-[120px]`}>
        {children}
      </div>
      <p className="text-caption text-bv-navy/72">{label}</p>
    </div>
  );
}
