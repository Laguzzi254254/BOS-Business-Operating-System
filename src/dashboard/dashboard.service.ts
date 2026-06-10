import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {

constructor(
private readonly prisma: PrismaService,
) {}

async getTopOpportunities() {


return this.prisma.opportunities.findMany({

  select: {

    id: true,

    opportunity_name: true,

    value: true,

    oqs_score: true,

    forecast_band: true,

    stage: true,

  },

  orderBy: {
    oqs_score: 'desc',
  },

  take: 10,

});

}

async getApprovalBottlenecks() {


return this.prisma.approval_workflows.groupBy({

  by: ['current_stage'],

  _count: true,

});


}

async getDashboardStats() {


const pendingApprovals =
  await this.prisma.approval_workflows.count({

    where: {
      status: {
        not: 'APPROVED',
      },
    },

  });

const approvedThisMonth =
  await this.prisma.approval_history.count({

    where: {
      decision: 'APPROVED',
    },

  });

const rejectedThisMonth =
  await this.prisma.approval_history.count({

    where: {
      decision: 'REJECTED',
    },

  });

const pipeline =
  await this.prisma.opportunities.aggregate({

    _sum: {
      value: true,
    },

  });

const commitRevenue =
  await this.prisma.opportunities.aggregate({

    where: {
      forecast_band: 'COMMIT',
    },

    _sum: {
      value: true,
    },

  });

const bestCaseRevenue =
  await this.prisma.opportunities.aggregate({

    where: {
      forecast_band: 'BEST_CASE',
    },

    _sum: {
      value: true,
    },

  });

const pipelineRevenue =
  await this.prisma.opportunities.aggregate({

    where: {
      forecast_band: 'PIPELINE',
    },

    _sum: {
      value: true,
    },

  });

const avgOQS =
  await this.prisma.opportunities.aggregate({

    _avg: {
      oqs_score: true,
    },

  });

const activeDelegations =
  await this.prisma.delegations.count({

    where: {
      active: true,
    },

  });

return {

  pendingApprovals,

  myApprovals: 0,

  approvedThisMonth,

  rejectedThisMonth,

  pipelineValue:
    Number(
      pipeline._sum.value ?? 0,
    ),

  commitRevenue:
    Number(
      commitRevenue._sum.value ?? 0,
    ),

  bestCaseRevenue:
    Number(
      bestCaseRevenue._sum.value ?? 0,
    ),

  pipelineRevenue:
    Number(
      pipelineRevenue._sum.value ?? 0,
    ),

  averageOQS:
    Number(
      avgOQS._avg.oqs_score ?? 0,
    ),

  activeDelegations,

};

}

}
