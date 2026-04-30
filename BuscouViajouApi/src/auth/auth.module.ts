import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwksService } from './jwks.service';
import { AuthGuard } from './auth.guard';
import { AuthController } from './auth.controller';

@Global()
@Module({
  controllers: [AuthController],
  providers: [
    JwksService,
    AuthGuard,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [JwksService, AuthGuard],
})
export class AuthModule {}
