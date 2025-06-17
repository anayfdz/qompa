export class Receipt {
  id!: string;
  company_id!: string;
  supplier_ruc!: string;
  invoice_number!: string;
  amount!: number;
  igv!: number;
  total!: number;
  issue_date!: Date;
  document_type!: string;
  state!: 'pending' | 'validated' | 'rejected' | 'observed';
  created_at!: Date;
  updated_at!: Date;
}
