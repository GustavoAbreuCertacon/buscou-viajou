import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwksService, SupabaseJwtPayload } from './jwks.service';
import { Request } from 'express';

export const IS_PUBLIC_KEY = 'isPublic';
export const IS_OPTIONAL_AUTH_KEY = 'isOptionalAuth';

export interface AuthenticatedRequest extends Request {
  user?: SupabaseJwtPayload;
  rawJwt?: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly jwks: JwksService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isOptional = this.reflector.getAllAndOverride<boolean>(IS_OPTIONAL_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractToken(request);

    if (!token) {
      if (isPublic || isOptional) return true;
      throw new UnauthorizedException('Missing bearer token');
    }

    try {
      const payload = await this.jwks.verify(token);
      request.user = payload;
      request.rawJwt = token;
      return true;
    } catch (err) {
      if (isOptional || isPublic) return true;
      this.logger.warn(`JWT verification failed: ${(err as Error).message}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractToken(request: AuthenticatedRequest): string | undefined {
    const header = request.headers.authorization;
    if (!header) return undefined;
    const [scheme, token] = header.split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || !token) return undefined;
    return token;
  }
}
