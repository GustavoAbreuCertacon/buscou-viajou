import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { AuthenticatedRequest } from './auth.guard';
import { SupabaseJwtPayload } from './jwks.service';

export const Public = () => SetMetadata('isPublic', true);
export const OptionalAuth = () => SetMetadata('isOptionalAuth', true);

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): SupabaseJwtPayload | undefined => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user;
  },
);

export const CurrentJwt = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.rawJwt;
  },
);
