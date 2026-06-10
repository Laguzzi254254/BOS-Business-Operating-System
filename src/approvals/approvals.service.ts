import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { DelegationsService }
from '../delegations/delegations.service';

@Injectable()
export class ApprovalsService {

constructor(
private readonly prisma: PrismaService,
private readonly auditService: AuditService,
private readonly delegationsService: DelegationsService,

) {}

private async canApproveForUser(
approverId: string,
expectedUserId: string,
) {

if (
approverId === expectedUserId
) {
return true;
}

const delegation =
await this.delegationsService
.getActiveDelegate(
expectedUserId,
);

if (
delegation &&
delegation.to_user === approverId
) {
return true;
}

return false;

}
private async getUserByRole(
role: string,
) {

return this.prisma.users.findFirst({


where: {
  role,
},


});

}


async submitForApproval(workflowId: string) {
return this.prisma.approval_workflows.update({
where: {
id: workflowId,
},
data: {
status: 'PENDING_BU_REVIEW',
current_stage: 'BU_LEAD',
},
});
}

async approveByBULead(
workflowId: string,
approverId: string,
comments: string,
) {


await this.prisma.approval_history.create({
  data: {
    workflow_id: workflowId,
    approver_id: approverId,
    role: 'BU_LEAD',
    decision: 'APPROVED',
    comments,
  },
});

return this.prisma.approval_workflows.update({
  where: {
    id: workflowId,
  },
  data: {
    status: 'PENDING_FINANCE_REVIEW',
    current_stage: 'FINANCE',
  },
});


}

async approveByFinance(
workflowId: string,
approverId: string,
comments: string,
) {


await this.prisma.approval_history.create({
  data: {
    workflow_id: workflowId,
    approver_id: approverId,
    role: 'FINANCE',
    decision: 'APPROVED',
    comments,
  },
});

return this.prisma.approval_workflows.update({
  where: {
    id: workflowId,
  },
  data: {
    status: 'PENDING_COO_APPROVAL',
    current_stage: 'COO',
  },
});


}


async approveByCOO(
workflowId: string,
approverId: string,
comments: string,
) {
const coo =
await this.getUserByRole(
'COO',
);

if (!coo) {
throw new Error(
'COO not found',
);
}

const allowed =
await this.canApproveForUser(
approverId,
coo.id,
);

if (!allowed) {
throw new Error(
'Not authorized to approve for COO',
);
}


await this.prisma.approval_history.create({
  data: {
    workflow_id: workflowId,
    approver_id: approverId,
    role: 'COO',
    decision: 'APPROVED',
    comments,
  },
});

return this.prisma.approval_workflows.update({
  where: {
    id: workflowId,
  },
  data: {
    status: 'APPROVED',
    current_stage: 'COO',
  },
});


}

async reject(
workflowId: string,
approverId: string,
role: string,
comments: string,
) {


await this.prisma.approval_history.create({
  data: {
    workflow_id: workflowId,
    approver_id: approverId,
    role,
    decision: 'REJECTED',
    comments,
  },
});

return this.prisma.approval_workflows.update({
  where: {
    id: workflowId,
  },
  data: {
    status: 'REJECTED',
  },
});


}

async getAllApprovals() {
return this.prisma.approval_workflows.findMany({
orderBy: {
created_at: 'desc',
},
});
}

async getApprovalById(id: string) {
return this.prisma.approval_workflows.findUnique({
where: {
id,
},
include: {
approval_history: true,
opportunities: true,
users: true,
},
});
}

async getApprovalHistory(workflowId: string) {
return this.prisma.approval_history.findMany({
where: {
workflow_id: workflowId,
},
orderBy: {
approved_at: 'desc',
},
});
}
}
