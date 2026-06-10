import { Module } from '@nestjs/common';

import { PrismaModule }
from '../prisma/prisma.module';

import { SpinController }
from './spin.controller';

import { SpinService }
from './spin.service';

@Module({

  imports: [
    PrismaModule,
  ],

  controllers: [
    SpinController,
  ],

  providers: [
    SpinService,
  ],

})
export class SpinModule {}