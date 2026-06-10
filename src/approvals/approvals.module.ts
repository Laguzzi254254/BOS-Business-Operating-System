import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { DelegationsModule } from '../delegations/delegations.module';
import { AuditModule } from '../audit/audit.module';

import { ApprovalsController } from './approvals.controller';
import { ApprovalsService } from './approvals.service';

@Module({

  imports: [

    PrismaModule,

    DelegationsModule,
     AuditModule,

  ],

  controllers: [
    ApprovalsController,
  ],

  providers: [
    ApprovalsService,
  ],

})
export class ApprovalsModule {}