import { IsString, IsNumber, IsDateString } from 'class-validator'

export class CreateReceiptDto {
  @IsString()
  company_id!: string

  @IsString()
  supplier_ruc!: string

  @IsString()
  invoice_number!: string

  @IsNumber()
  amount!: number

  @IsDateString()
  issue_date!: string

  @IsString()
  document_type!: string
}
