import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ProxyModule } from './modules/proxy/proxy.module.js';
import { AppController } from './app.controller.js';
import { MiddlewareModule } from './modules/middleware/middleware.module.js';
import { LoggingMiddleware } from './modules/middleware/middlewares/logging.middleware.js';
import { SharedModule } from './modules/shared/shared.module.js';
import { AuthModule } from './modules/auth/auth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    ProxyModule,
    MiddlewareModule,
    SharedModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
