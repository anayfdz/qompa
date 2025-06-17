import { Module } from '@nestjs/common';
import { ReceiptsModule } from './receipts/receipts.module';

@Module({
  imports: [ReceiptsModule],
})
export class AppModule {}
