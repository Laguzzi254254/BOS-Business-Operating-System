import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class DelegationsService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

async create(dto: any) {

  const delegation =
    await this.prisma.delegations.create({

      data: {

        from_user: dto.from_user,

        to_user: dto.to_user,

        start_date: new Date(
          dto.start_date,
        ),

        end_date: new Date(
          dto.end_date,
        ),

      },

    });

  await this.auditService.log(

    dto.from_user,

    'DELEGATION',

    delegation.id,

    'CREATED',

    null,

    delegation,

  );

  return delegation;

}

  async findAll() {

    return this.prisma.delegations.findMany();

  }
  async getActiveDelegate(
userId: string,
) {

const today = new Date();

return this.prisma.delegations.findFirst({


where: {

  from_user: userId,

  active: true,

  start_date: {
    lte: today,
  },

  end_date: {
    gte: today,
  },

},


});

}


async revoke(
  id: string,
) {

  const delegation =
    await this.prisma.delegations.update({

      where: {
        id,
      },

      data: {
        active: false,
      },

    });

  await this.auditService.log(

    delegation.from_user,

    'DELEGATION',

    id,

    'REVOKED',

    {
      active: true,
    },

    {
      active: false,
    },

  );

  return delegation;

}


}