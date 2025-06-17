import { Injectable } from "@nestjs/common"
import { CreateReceiptDto } from "./dto/create-receipt.dto"
import { UpdateReceiptStateDto } from "./dto/update-receipt-state.dto"
import { ReceiptsRepository } from "./receipts.repository"
import { Receipt } from "./entities/receipt.entity"

@Injectable()
export class ReceiptsService {
  constructor(private readonly repo: ReceiptsRepository) {}

  async register(dto: CreateReceiptDto) {
    const igv = parseFloat((dto.amount * 0.18).toFixed(2))
    const total = parseFloat((dto.amount + igv).toFixed(2))

    const state = await this.simulateSunatValidation(dto)

    return this.repo.create({
      ...dto,
      igv,
      total,
      state
    })
  }

  private async simulateSunatValidation(dto: CreateReceiptDto): Promise<string> {
    // Simulación SUNAT
    if (dto.supplier_ruc.startsWith('10')) return 'validated'
    if (dto.supplier_ruc.startsWith('20')) return 'rejected'
    return 'observed'
  }

   async updateState(id: string, dto: UpdateReceiptStateDto) {
    return this.repo.updateState(id, dto.state);
  }

  async findAll(query: any) {
    return this.repo.findAllWithFilters(query);
  }
   async exportCsv(query: any) {
    const receipts = await this.repo.findAllWithFilters(query);
    const csvRows = receipts.map((r: Receipt)=> ({
      ...r,
      igv: +(r.amount * 0.18).toFixed(2),
      total: +(r.amount * 1.18).toFixed(2),
    }));

    const fields = ['company_id', 'supplier_ruc', 'invoice_number', 'amount', 'igv', 'total', 'issue_date', 'state'];
    const { Parser } = require('json2csv');
    const parser = new Parser({ fields });
    return parser.parse(csvRows);
  }

  async queryWithAI(question: string) {
    if (question.toLowerCase().includes('validados en mayo')) {
      const result = await this.repo.sumValidatedInMonth(5); // mayo
      return `El total de comprobantes validados en mayo es S/. ${result}`;
    }
    return 'No se pudo entender la consulta.';
  }

}
