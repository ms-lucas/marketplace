import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { setupSecurity } from './config/bootstrap/security.config.js';
import { setupGlobals } from './config/bootstrap/globals.config.js';
import { setupSwagger } from './config/bootstrap/swagger.config.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSecurity(app);
  setupGlobals(app);
  setupSwagger(app);

  await app.listen(process.env.PORT || 3000);
}
await bootstrap();
