import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { randomUUID } from 'crypto';

interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  error_id: string;
  errors?: unknown;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const errorId = randomUUID();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let title = 'Internal Server Error';
    let detail = 'Algo deu errado. Nossa equipe já foi notificada.';
    let errors: unknown;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resp = exception.getResponse();
      if (typeof resp === 'string') {
        detail = resp;
        title = exception.message;
      } else if (typeof resp === 'object' && resp !== null) {
        const r = resp as Record<string, unknown>;
        title = (r.error as string) ?? exception.message;
        detail = Array.isArray(r.message) ? r.message.join('; ') : (r.message as string) ?? detail;
        errors = r.errors;
      }
    } else if (exception instanceof Error) {
      detail = exception.message || detail;
      this.logger.error(`[${errorId}] Unhandled exception`, exception.stack);
    }

    const problem: ProblemDetails = {
      type: `https://api.buscouviajou.com.br/errors/${this.slugify(title)}`,
      title,
      status,
      detail,
      instance: request.url,
      error_id: errorId,
    };
    if (errors) problem.errors = errors;

    response.status(status).type('application/problem+json').json(problem);
  }

  private slugify(s: string): string {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
}
