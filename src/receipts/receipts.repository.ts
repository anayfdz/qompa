import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class ReceiptsRepository {
  async create(data: any) {
    return prisma.receipt.create({ data });
  }

  async updateState(id: string, state: string) {
    return prisma.receipt.update({
      where: { id },
      data: { state },
    });
  }

  async findAllWithFilters(query: any) {
    const { document_type, state, from, to } = query;

    return prisma.receipt.findMany({
      where: {
        ...(document_type && { document_type }),
        ...(state && { state }),
        ...(from && to && {
          issue_date: {
            gte: new Date(from),
            lte: new Date(to),
          },
        }),
      },
    });
  }

  async sumValidatedInMonth(month: number) {
    const result = await prisma.receipt.aggregate({
      _sum: { total: true },
      where: {
        state: 'validated',
        issue_date: {
          gte: new Date(`2025-${month.toString().padStart(2, '0')}-01`),
          lt: new Date(`2025-${(month + 1).toString().padStart(2, '0')}-01`),
        },
      },
    });

    return result._sum.total ?? 0;
  }
}
