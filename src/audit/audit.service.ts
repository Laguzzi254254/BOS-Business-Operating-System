import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {

constructor(
private readonly prisma: PrismaService,
) {}

async log(
userId: string,
entityType: string,
entityId: string,
action: string,
oldValues?: any,
newValues?: any,
) {


return this.prisma.audit_logs.create({

  data: {

    user_id: userId,

    entity_type: entityType,

    entity_id: entityId,

    action,

    old_values: oldValues,

    new_values: newValues,

  },

});


}

async findAll() {


return this.prisma.audit_logs.findMany({

  orderBy: {
    created_at: 'desc',
  },

  take: 100,

});


}


}
