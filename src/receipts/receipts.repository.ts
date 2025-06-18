import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from './dto/pagination.dto';

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

  async findAllWithFilters(query: any, pagination: PaginationDto) {
    const { document_type, state, from, to } = query;
    const page = Number(pagination.page ?? 1);
    const limit = Number(pagination.limit ?? 10);
    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      prisma.receipt.count({
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
      }),
      prisma.receipt.findMany({
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
        skip,
        take: limit,
        orderBy: {
          created_at: 'desc',
        },
      }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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
