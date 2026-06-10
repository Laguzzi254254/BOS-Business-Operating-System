import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
} from '@nestjs/common';

import { DelegationsService } from './delegations.service';

@Controller('delegations')
export class DelegationsController {

constructor(
private readonly delegationsService: DelegationsService,
) {}

@Post()
create(
@Body() dto: any,
) {
return this.delegationsService.create(dto);
}

@Get()
findAll() {
return this.delegationsService.findAll();
}

@Patch(':id/revoke')
revoke(
  @Param('id') id: string,
) {

  return this.delegationsService
    .revoke(id);

}


}
