import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';

import { SpinService } from './spin.service';

@Controller('spin')
export class SpinController {

  constructor(
    private readonly spinService: SpinService,
  ) {}

  @Get()
  findAll() {

    return this.spinService.findAll();

  }

  @Get(':opportunityId')
  findOne(
    @Param('opportunityId')
    opportunityId: string,
  ) {

    return this.spinService.findOne(
      opportunityId,
    );

  }

}