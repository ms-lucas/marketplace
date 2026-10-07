import { Module } from '@nestjs/common';
import { CustomThrottlerGuard } from './guards/throttler.guard.js';

@Module({
  imports: [],
  providers: [CustomThrottlerGuard],
  exports: [CustomThrottlerGuard],
})
export class SharedModule {}
