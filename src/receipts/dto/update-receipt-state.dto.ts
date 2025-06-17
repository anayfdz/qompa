import { IsString } from 'class-validator';

export class UpdateReceiptStateDto {
  @IsString()
  state!: 'pending' | 'validated' | 'rejected' | 'observed';
}
