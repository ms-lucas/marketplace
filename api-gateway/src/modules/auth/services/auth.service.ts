import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpClient } from '@nestjs/http-client';
import { ConfigService } from '@nestjs/config';

interface LoginDto {
  email: string;
  password: string;
}

type RegisterDto = Record<string, unknown>;

export interface UserSession {
  valid: boolean;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    status: string;
  } | null;
}

interface UserServiceResponse {
  access_token?: string;
  [key: string]: unknown;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly httpClient: HttpClient,
    private readonly configService: ConfigService,
  ) {}

  validateJwtToken(token: string): Record<string, unknown> {
    try {
      return this.jwtService.verify<Record<string, unknown>>(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid JWT token');
    }
  }

  async validateSessionToken(sessionToken: string): Promise<UserSession> {
    try {
      const { data } = await this.httpClient.get<UserSession>(
        `${this.usersServiceUrl}/sessions/validate`,
        {
          params: { sessionToken },
          signal: this.createTimeoutSignal(),
        },
      );

      return data;
    } catch (error) {
      throw new UnauthorizedException('Invalid session token');
    }
  }

  async login(loginDto: LoginDto): Promise<UserServiceResponse> {
    try {
      const { data } = await this.httpClient.post<UserServiceResponse>(
        `${this.usersServiceUrl}/login`,
        {
          json: loginDto,
          signal: this.createTimeoutSignal(),
        },
      );

      return data;
    } catch (error) {
      throw new UnauthorizedException('Invalid login credentials');
    }
  }

  async register(registerDto: RegisterDto): Promise<UserServiceResponse> {
    try {
      const { data } = await this.httpClient.post<UserServiceResponse>(
        `${this.usersServiceUrl}/auth/register`,
        {
          json: registerDto,
          signal: this.createTimeoutSignal(),
        },
      );

      return data;
    } catch (error) {
      throw new UnauthorizedException('Registration failed');
    }
  }

  private get usersServiceUrl(): string {
    return this.configService.getOrThrow<string>('USERS_SERVICE_URL');
  }

  private createTimeoutSignal(): AbortSignal {
    return AbortSignal.timeout(
      this.configService.get<number>('USERS_SERVICE_TIMEOUT', 5000),
    );
  }
}
