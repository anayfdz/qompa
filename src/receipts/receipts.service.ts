import { Injectable } from "@nestjs/common"
import { CreateReceiptDto } from "./dto/create-receipt.dto"
import { UpdateReceiptStateDto } from "./dto/update-receipt-state.dto"
import { ReceiptsRepository } from "./receipts.repository"
import { Receipt } from "./entities/receipt.entity"
import { PaginationDto } from "./dto/pagination.dto"
import * as fs from 'fs';
import * as path from 'path';

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

  async findAll(query: any, pagination: PaginationDto) {
    return this.repo.findAllWithFilters(query, pagination);
  }

  async exportCsv(query: any) {
    const { items: receipts } = await this.repo.findAllWithFilters(query, { page: 1, limit: 1000 });
    const csvRows = receipts.map((r: any)=> ({
      ...r,
      igv: +(r.amount * 0.18).toFixed(2),
      total: +(r.amount * 1.18).toFixed(2),
    }));

    const fields = ['company_id', 'supplier_ruc', 'invoice_number', 'amount', 'igv', 'total', 'issue_date', 'state'];
    const { Parser } = require('json2csv');
    const parser = new Parser({ fields });
    const csv = parser.parse(csvRows);

    // Guardar el archivo en disco
    const exportDir = path.join(process.cwd(), 'exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
    }
    const filePath = path.join(exportDir, `receipts_${Date.now()}.csv`);
    console.log('Intentando guardar CSV en disco...');
    fs.writeFileSync(filePath, csv);
    console.log('CSV guardado en:', filePath);

    return csv;
  }

  async queryWithAI(question: string) {
    if (question.toLowerCase().includes('validados en mayo')) {
      const result = await this.repo.sumValidatedInMonth(5); // mayo
      return `El total de comprobantes validados en mayo es S/. ${result}`;
    }
    return 'No se pudo entender la consulta.';
  }
}
