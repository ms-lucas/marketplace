import { INestApplication } from '@nestjs/common';
import helmet from 'helmet';

export function setupSecurity(app: INestApplication): void {
    app.use(helmet());
    app.enableCors({
        origin: ['*'],
        methods: ['GET, POST, PUT, PATCH, DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
}