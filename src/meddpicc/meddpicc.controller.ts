import {
Controller,
Post,
Get,
Patch,
Delete,
Param,
Body,
} from '@nestjs/common';

import { MeddpiccService } from './meddpicc.service';

import { CreateMeddpiccDto } from './dto/create-meddpicc.dto';
import { UpdateMeddpiccDto } from './dto/update-meddpicc.dto';

@Controller('meddpicc')
export class MeddpiccController {

constructor(
private readonly meddpiccService: MeddpiccService,
) {}

@Post()
create(
@Body() dto: CreateMeddpiccDto,
) {
return this.meddpiccService.create(dto);
}

@Get()
findAll() {
return this.meddpiccService.findAll();
}

@Get(':opportunityId')
findOne(
@Param('opportunityId')
opportunityId: string,
) {
return this.meddpiccService.findOne(
opportunityId,
);
}

@Patch(':opportunityId')
update(
@Param('opportunityId')
opportunityId: string,


@Body()
dto: UpdateMeddpiccDto,


) {
return this.meddpiccService.update(
opportunityId,
dto,
);
}

@Delete(':opportunityId')
remove(
@Param('opportunityId')
opportunityId: string,
) {
return this.meddpiccService.remove(
opportunityId,
);
}
}