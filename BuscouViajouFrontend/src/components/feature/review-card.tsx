import { StarRating } from '@/components/ui/star-rating';
import { formatRelativeDay } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

interface ReviewClient {
  first_name: string;
  /** Inicial do sobrenome (privacidade — backend só envia 1 letra) */
  last_initial?: string | null;
}

interface ReviewResponse {
  response: string;
  created_at?: string;
}

export interface ReviewCardProps {
  rating: number;
  comment?: string | null;
  createdAt: string;
  client: ReviewClient | null;
  /** Nome do veículo, opcional — exibido como metadata */
  vehicleModel?: string | null;
  /** Resposta da empresa, opcional */
  response?: ReviewResponse | null;
  className?: string;
}

/**
 * ReviewCard — uma avaliação de cliente sobre uma viagem.
 * Privacidade: nome só com primeiro nome + inicial do sobrenome.
 */
export function ReviewCard({
  rating,
  comment,
  createdAt,
  client,
  vehicleModel,
  response,
  className,
}: ReviewCardProps) {
  const displayName = client
    ? `${client.first_name}${client.last_initial ? ` ${client.last_initial}.` : ''}`
    : 'Cliente';

  return (
    <article
      className={cn(
        'rounded-bv-md bg-white border border-bv-navy/12 p-bv-5',
        className,
      )}
    >
      <header className="flex items-start justify-between gap-bv-3">
        <div className="flex items-center gap-bv-3">
          <span
            aria-hidden
            className="h-10 w-10 rounded-full bg-bv-navy text-white flex items-center justify-center font-heading font-bold text-body-sm uppercase"
          >
            {client?.first_name?.[0] ?? '?'}
          </span>
          <div>
            <p className="font-semibold text-bv-navy text-body">{displayName}</p>
            <p className="text-caption text-bv-navy/72">{formatRelativeDay(createdAt)}</p>
          </div>
        </div>
        <StarRating value={rating} size="sm" />
      </header>

      {comment && (
        <p className="mt-bv-3 text-body text-bv-navy leading-relaxed">{comment}</p>
      )}

      {vehicleModel && (
        <p className="mt-bv-2 text-caption text-bv-navy/72">{vehicleModel}</p>
      )}

      {response?.response && (
        <div className="mt-bv-4 ml-bv-4 pl-bv-4 border-l-bv-base border-bv-green/40">
          <p className="text-body-sm font-semibold text-bv-green-700">Resposta da empresa</p>
          <p className="mt-bv-1 text-body-sm text-bv-navy/80 leading-relaxed">
            {response.response}
          </p>
          {response.created_at && (
            <p className="mt-bv-1 text-caption text-bv-navy/72">
              {formatRelativeDay(response.created_at)}
            </p>
          )}
        </div>
      )}
    </article>
  );
}
