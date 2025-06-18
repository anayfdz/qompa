import { IsString, IsNumber, IsDateString, Min, Matches, Length, IsIn } from 'class-validator'

export class CreateReceiptDto {
  @IsString()
  @Length(1, 50)
  company_id!: string

  @IsString()
  @Length(11, 11)
  @Matches(/^\d{11}$/, { message: 'El RUC debe tener 11 dígitos' })
  supplier_ruc!: string

  @IsString()
  @Length(1, 20)
  invoice_number!: string

  @IsNumber()
  @Min(0)
  amount!: number

  @IsDateString()
  issue_date!: string

  @IsString()
  @IsIn(['factura', 'boleta', 'nota_credito', 'nota_debito'])
  document_type!: string
}
