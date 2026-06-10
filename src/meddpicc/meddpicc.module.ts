import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';

import { MeddpiccController } from './meddpicc.controller';
import { MeddpiccService } from './meddpicc.service';

@Module({
  imports: [PrismaModule],
  controllers: [MeddpiccController],
  providers: [MeddpiccService],
})
export class MeddpiccModule {}