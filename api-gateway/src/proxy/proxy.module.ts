import { Module } from '@nestjs/common';
import { ProxyService } from './services/proxy.service.js';
import { HttpClientModule } from '@nestjs/http-client';

@Module({
  imports: [HttpClientModule.register()],
  providers: [ProxyService],
  exports: [ProxyService],
})
export class ProxyModule {}
