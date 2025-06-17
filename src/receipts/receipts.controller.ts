import { Controller, Post, Body, Get, Patch, Param, Query, Res } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { UpdateReceiptStateDto } from './dto/update-receipt-state.dto';
import { Response } from 'express';

@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly service: ReceiptsService) {}

  @Post()
  create(@Body() dto: CreateReceiptDto) {
    return this.service.register(dto);
  }

  @Patch(':id/state')
  updateState(@Param('id') id: string, @Body() dto: UpdateReceiptStateDto) {
    return this.service.updateState(id, dto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get('export')
  async export(@Query() query: any, @Res() res: Response) {
    const csv = await this.service.exportCsv(query);
    res.header('Content-Type', 'text/csv');
    res.attachment('receipts.csv');
    res.send(csv);
  }

  @Post('ai-query')
  async aiQuery(@Body() body: { question: string }) {
    return {
      answer: await this.service.queryWithAI(body.question),
    };
  }
}
