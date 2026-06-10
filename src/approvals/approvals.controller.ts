import {
Controller,
Get,
Post,
Patch,
Param,
} from '@nestjs/common';

import { ApprovalsService } from './approvals.service';
import { Roles } from '../shared/decorators/roles.decorator';

@Controller('approvals')
export class ApprovalsController {

constructor(
private readonly approvalsService: ApprovalsService,
) {}

@Get()
  findAll() {
    return this.approvalsService.getAllApprovals();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.approvalsService.getApprovalById(id);
  }

@Post(':id/submit')
submit(
@Param('id') id: string,
) {
return this.approvalsService.submitForApproval(id);
}

@Roles('BU_LEAD')
@Patch(':id/bu-approve')
approveByBULead(
  @Param('id') id: string,
) {
  return this.approvalsService.approveByBULead(
    id,
    '4c551183-79e7-4a8d-9258-74acb049a0ad', // Wilson
    'Approved by BU Lead',
  );
}

@Roles('FINANCE')
@Patch(':id/finance-approve')
approveByFinance(
  @Param('id') id: string,
) {
  return this.approvalsService.approveByFinance(
    id,
    'ba7935bc-bf2a-4270-98ab-ece1cf2e015c',
    'Approved by Finance',
  );
}

@Roles('COO')
@Patch(':id/coo-approve')
approveByCOO(
  @Param('id') id: string,
) {
  return this.approvalsService.approveByCOO(
    id,
    '23b1f50e-b763-4bd7-930b-6c0e90864863',
    'Approved by COO',
  );
}
@Patch(':id/reject')
reject(
@Param('id') id: string,
) {
return this.approvalsService.reject(
id,
'',
'UNKNOWN',
'Rejected',
);
}
}
