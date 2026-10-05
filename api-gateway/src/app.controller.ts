import { Controller, Get } from '@nestjs/common';
import { ProxyService } from './proxy/services/proxy.service.js';

@Controller()
export class AppController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get('health')
  async getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        users: await this.proxyService.getServiceHealth('users'),
        products: await this.proxyService.getServiceHealth('products'),
        checkout: await this.proxyService.getServiceHealth('checkout'),
        payments: await this.proxyService.getServiceHealth('payments'),
      },
    };
  }
}
