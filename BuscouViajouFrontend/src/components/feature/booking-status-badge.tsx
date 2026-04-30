import {
  Clock,
  CreditCard,
  CheckCircle2,
  Truck,
  CircleDot,
  CheckCheck,
  XCircle,
  Ban,
  AlertCircle,
  TimerOff,
  UserX,
  AlertTriangle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { BookingStatus } from '@/lib/api/types';

interface Props {
  status: BookingStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CONFIG: Record<
  BookingStatus,
  { label: string; variant: Parameters<typeof Badge>[0]['variant']; Icon: typeof Clock }
> = {
  PENDING_APPROVAL:    { label: 'Aguardando aprovação', variant: 'warning',    Icon: Clock },
  PENDING_PAYMENT:     { label: 'Aguardando pagamento', variant: 'warning',    Icon: CreditCard },
  CONFIRMED:           { label: 'Confirmada',           variant: 'solidGreen', Icon: CheckCircle2 },
  IN_PROGRESS:         { label: 'Em andamento',         variant: 'solidNavy',  Icon: Truck },
  PENDING_COMPLETION:  { label: 'Aguardando confirmação', variant: 'warning',  Icon: CircleDot },
  COMPLETED:           { label: 'Concluída',            variant: 'accent',     Icon: CheckCheck },
  CANCELLED_BY_CLIENT: { label: 'Cancelada por você',   variant: 'neutral',    Icon: XCircle },
  CANCELLED_BY_COMPANY:{ label: 'Cancelada pela empresa', variant: 'danger',   Icon: Ban },
  REJECTED:            { label: 'Recusada',             variant: 'neutral',    Icon: AlertCircle },
  EXPIRED:             { label: 'Expirada',             variant: 'neutral',    Icon: TimerOff },
  NO_SHOW_CLIENT:      { label: 'Você não compareceu',  variant: 'neutral',    Icon: UserX },
  NO_SHOW_COMPANY:     { label: 'Empresa não compareceu', variant: 'danger',   Icon: AlertTriangle },
};

/**
 * BookingStatusBadge — visualiza o status de uma reserva.
 * 12 estados conforme PRD §12.2.1 (booking_status enum).
 */
export function BookingStatusBadge({ status, size = 'md', className }: Props) {
  const cfg = CONFIG[status];
  const { Icon } = cfg;
  const iconSize = size === 'sm' ? 11 : size === 'lg' ? 16 : 13;

  return (
    <Badge
      variant={cfg.variant}
      size={size}
      className={className}
      iconLeft={<Icon size={iconSize} strokeWidth={2.5} />}
    >
      {cfg.label}
    </Badge>
  );
}
