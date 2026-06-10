import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';

import { DelegationsController } from './delegations.controller';
import { DelegationsService } from './delegations.service';

@Module({

  imports: [
    PrismaModule,
    AuditModule,
  ],

  controllers: [
    DelegationsController,
  ],

  providers: [
    DelegationsService,
  ],

  exports: [
    DelegationsService,
  ],

})
export class DelegationsModule {}