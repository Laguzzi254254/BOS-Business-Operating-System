import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class OpportunitiesService {

	

constructor(
  private readonly prisma: PrismaService,
  private readonly auditService: AuditService,
) {}

	async create(
  dto: CreateOpportunityDto,
) {
  return this.prisma.opportunities.create({
    data: {
      opportunity_name: dto.opportunity_name,
      account_id: dto.account_id,
      stage: dto.stage,
      value: dto.value,
      forecast_band: dto.forecast_band,
      owner_id: dto.owner_id,
    },
  });
}

async findAll() {
  return this.prisma.opportunities.findMany({
    orderBy: {
      created_at: 'desc',
    },
  });
}

async findOne(
  id: string,
) {

  return this.prisma.opportunities.findUnique({

    where: {
      id,
    },

  });

}

async update(
  id: string,
  dto: UpdateOpportunityDto,
) {

  const existing =
    await this.prisma.opportunities.findUnique({

      where: {
        id,
      },

    });

  const updated =
    await this.prisma.opportunities.update({

      where: {
        id,
      },

      data: dto,

    });

  await this.auditService.log(

    'SYSTEM',

    'OPPORTUNITY',

    id,

    'UPDATED',

    existing,

    updated,

  );

  return updated;

}
async remove(id: string) {
  return this.prisma.opportunities.delete({
    where: {
      id,
    },
  });
}

}
