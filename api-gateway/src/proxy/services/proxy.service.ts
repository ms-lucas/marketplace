import { Injectable, Logger } from '@nestjs/common';
import { HttpClient } from '@nestjs/http-client';
import { serviceConfig } from '../../config/modules/gateway.config.js';

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);

  constructor(private readonly httpClient: HttpClient) {}

  async proxyRequest(
    serviceName: keyof typeof serviceConfig,
    method: string,
    path: string,
    data?: any,
    headers?: any,
    userInfo?: any,
  ) {
    const service = serviceConfig[serviceName];
    const url = `${service.url}${path}`;

    this.logger.log(`Proxying ${method} request to ${serviceName}: ${url}`);

    try {
      const requestHeaders = {
        'Content-Type': 'application/json',
        ...headers,
      };

      const enhancedHeaders = {
        ...requestHeaders,
        'x-user-id': userInfo?.userId,
        'x-user-email': userInfo?.email,
        'x-user-role': userInfo?.role,
      };

      const response = await this.httpClient.request(url, {
        method: method.toUpperCase(),
        headers: {
          ...enhancedHeaders,
        },
        body: data ? JSON.stringify(data) : undefined,
        signal: AbortSignal.timeout(service.timeout),
      });

      return response;
    } catch (error) {
      this.logger.error(
        `Error proxying ${method} request to ${serviceName}: ${url}`,
      );
      throw error;
    }
  }

  async getServiceHealth(serviceName: keyof typeof serviceConfig) {
    try {
      const service = serviceConfig[serviceName];

      const response = await this.httpClient.get(`${service.url}/health`, {
        signal: AbortSignal.timeout(3000),
      });

      return { status: 'healthy', data: response.data };
    } catch (error: any) {
      return { status: 'unhealthy', error: error.message };
    }
  }
}
