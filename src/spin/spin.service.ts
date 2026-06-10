import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SpinService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll() {

    return this.prisma.spin_records.findMany({

      orderBy: {
        created_at: 'desc',
      },

    });

  }

  async findOne(
    opportunityId: string,
  ) {

    return this.prisma.spin_records.findUnique({

      where: {
        opportunity_id:
          opportunityId,
      },

    });

  }

}