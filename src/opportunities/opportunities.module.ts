import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';

import { OpportunitiesController } from './opportunities.controller';
import { OpportunitiesService } from './opportunities.service';

@Module({

imports: [
PrismaModule,
AuditModule,
],

controllers: [
OpportunitiesController,
],

providers: [
OpportunitiesService,
],

exports: [
OpportunitiesService,
],

})
export class OpportunitiesModule {}
