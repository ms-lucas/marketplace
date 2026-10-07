import { Module } from '@nestjs/common';
import { LoggingMiddleware } from './middlewares/logging.middleware.js';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
    imports: [
        ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    ],
    providers: [LoggingMiddleware],
    exports: []
})
export class MiddlewareModule {}